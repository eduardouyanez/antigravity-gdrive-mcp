#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { google } from "googleapis";
import { authenticate } from "@google-cloud/local-auth";
import fs from "fs/promises";
import path from "path";

let drive;
let sheets;

const SCOPES = [
    "https://www.googleapis.com/auth/drive.readonly",
    "https://www.googleapis.com/auth/spreadsheets.readonly"
];

// Use environment variables or fallback to work defaults
const CREDENTIALS_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS || "C:/mcp-servers/gdrive-mcp-server/credentials/gcp-oauth.keys.json";
const TOKEN_PATH = process.env.MCP_GDRIVE_CREDENTIALS || "C:/mcp-servers/gdrive-mcp-server/credentials/.gdrive-server-credentials.json";

async function authenticateAndSaveCredentials() {
    const client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    await fs.writeFile(TOKEN_PATH, JSON.stringify(client.credentials));
    return client;
}

async function startServer() {
    try {
        const keysContent = JSON.parse(await fs.readFile(CREDENTIALS_PATH, "utf8"));
        const keys = keysContent.installed || keysContent.web;
        const auth = new google.auth.OAuth2(keys.client_id, keys.client_secret, "http://localhost:3000");
        auth.setCredentials(JSON.parse(await fs.readFile(TOKEN_PATH, "utf8")));

        drive = google.drive({ version: "v3", auth });
        sheets = google.sheets({ version: "v4", auth });

        const server = new Server({
            name: "gdrive-server",
            version: "1.0.0",
        }, {
            capabilities: { tools: {} },
        });

        server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: "gdrive_list_sheets",
                    description: "List sheets in a spreadsheet",
                    inputSchema: {
                        type: "object",
                        properties: { file_id: { type: "string" } },
                        required: ["file_id"],
                    },
                },
                {
                    name: "gdrive_read_file",
                    description: "Read a file or a specific sheet (using gid)",
                    inputSchema: {
                        type: "object",
                        properties: {
                            file_id: { type: "string" },
                            gid: { type: "string" },
                        },
                        required: ["file_id"],
                    },
                }
            ],
        }));

        server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            try {
                if (name === "gdrive_list_sheets") {
                    const res = await sheets.spreadsheets.get({ spreadsheetId: args.file_id });
                    const info = res.data.sheets?.map(s => `${s.properties.title} (GID: ${s.properties.sheetId})`).join("\n") || "";
                    return { content: [{ type: "text", text: info }] };
                }
                if (name === "gdrive_read_file") {
                    const content = await readFileContent(args.file_id, args.gid);
                    return { content: [{ type: "text", text: content }] };
                }
                throw new Error(`Tool not found: ${name}`);
            } catch (error) {
                return { isError: true, content: [{ type: "text", text: error.message }] };
            }
        });

        const transport = new StdioServerTransport();
        await server.connect(transport);
    } catch (error) {
        // Silent fail to avoid polluting stdout
    }
}

async function readFileContent(fileId, gid) {
    const file = await drive.files.get({ fileId, fields: "mimeType", supportsAllDrives: true });

    if (file.data.mimeType === "application/vnd.google-apps.spreadsheet" && gid) {
        const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: fileId });
        const sheet = spreadsheet.data.sheets.find(s => s.properties.sheetId.toString() === gid.toString());
        if (sheet) {
            const res = await sheets.spreadsheets.values.get({ spreadsheetId: fileId, range: sheet.properties.title });
            return JSON.stringify(res.data.values, null, 2);
        }
    }

    let exportMimeType = "text/plain";
    if (file.data.mimeType === "application/vnd.google-apps.spreadsheet") exportMimeType = "text/csv";
    if (file.data.mimeType.startsWith("application/vnd.google-apps")) {
        const res = await drive.files.export({ fileId, mimeType: exportMimeType }, { responseType: "text" });
        return res.data;
    }
    const res = await drive.files.get({ fileId, alt: "media", supportsAllDrives: true }, { responseType: "arraybuffer" });
    return Buffer.from(res.data).toString("utf8");
}

if (process.argv[2] === "auth") {
    authenticateAndSaveCredentials().catch(() => { });
} else {
    startServer().catch(() => { });
}
