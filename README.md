# Antigravity Google Drive MCP Server (Multi-Account Support)

[English](#english) | [Español](#español)

---

<a name="english"></a>
## English

This is an MCP (Model Context Protocol) server designed to connect **Antigravity** (or other MCP clients) with multiple Google Drive accounts simultaneously.

Unlike the original version, this implementation allows parameterizing credential paths via environment variables, making it easy to run multiple instances (e.g., Work and Personal) without conflicts.

### Features
- **Multi-account**: Register as many servers as you need in your `mcp_config.json`.
- **Google Sheets Support**: Includes tools to list spreadsheet tabs.
- **Configurable via Env Vars**: No more hardcoded paths; you decide where to store your keys.

### Prerequisites (Google Cloud)

To allow Antigravity to access your files, you must enable services in the [Google Cloud Console](https://console.cloud.google.com/):

1. **Create Project**: Create a new project (e.g., "Antigravity Drive").
2. **Enable APIs**: Search for and enable:
   - **Google Drive API**
   - **Google Sheets API**
3. **Configure Consent Screen (OAuth Consent Screen)**:
   - Choose an app name.
   - Add your email as a **Test User**.
4. **Create Credentials**:
   - Go to "Credentials" -> "Create Credentials" -> **OAuth client ID**.
   - Application type: **Desktop App**.
   - Download the JSON file (this will be your `GOOGLE_APPLICATION_CREDENTIALS` keys).

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/eduardouyanez/antigravity-gdrive-mcp.git
   cd antigravity-gdrive-mcp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

### Antigravity Configuration

Add each account as an independent server in your `mcp_config.json`:

```json
{
  "mcpServers": {
    "gdrive-work": {
      "command": "node",
      "args": ["ABSOLUTE_PATH/dist/index.js"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "PATH_TO_WORK_KEYS.json",
        "MCP_GDRIVE_CREDENTIALS": "PATH_TO_WORK_TOKEN.json"
      }
    },
    "gdrive-personal": {
      "command": "node",
      "args": ["ABSOLUTE_PATH/dist/index.js"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "PATH_TO_PERSONAL_KEYS.json",
        "MCP_GDRIVE_CREDENTIALS": "PATH_TO_PERSONAL_TOKEN.json"
      }
    }
  }
}
```

### Initial Authentication

You must generate the access token for each account by running the authentication command manually for each instance:

```bash
# For work account (Powershell)
$env:GOOGLE_APPLICATION_CREDENTIALS='path/to/work-keys.json'; $env:MCP_GDRIVE_CREDENTIALS='path/to/work-token.json'; node dist/index.js auth

# For personal account (Powershell)
$env:GOOGLE_APPLICATION_CREDENTIALS='path/to/personal-keys.json'; $env:MCP_GDRIVE_CREDENTIALS='path/to/personal-token.json'; node dist/index.js auth
```

### Included Tools
- `gdrive_search`: Search files in the connected Drive.
- `gdrive_read_file`: Read file content (converts Docs to Markdown and Sheets to CSV).
- `gdrive_list_sheets`: List the tabs of a Google Spreadsheet.

---

<a name="español"></a>
## Español

Este es un servidor MCP (Model Context Protocol) diseñado para conectar **Antigravity** (u otros clientes MCP) con múltiples cuentas de Google Drive simultáneamente.

A diferencia de la versión original, esta implementación permite parametrizar las rutas de las credenciales mediante variables de entorno, lo que facilita ejecutar varias instancias (ej: Trabajo y Personal) sin que entren en conflicto.

### Características
- **Multi-cuenta**: Registra tantos servidores como necesites en tu `mcp_config.json`.
- **Soporte de Google Sheets**: Incluye herramientas para listar pestañas de hojas de cálculo.
- **Configuración mediante Env Vars**: No más rutas fijas; tú decides dónde guardar tus llaves.

### Requisitos Previos (Google Cloud)

Para que Antigravity pueda acceder a tus archivos, debes habilitar los servicios en [Google Cloud Console](https://console.cloud.google.com/):

1. **Crear Proyecto**: Crea un nuevo proyecto (ej: "Antigravity Drive").
2. **Habilitar APIs**: Busca y habilita las siguientes APIs:
   - **Google Drive API**
   - **Google Sheets API**
3. **Configurar Consentimiento (OAuth Consent Screen)**:
   - Elige un nombre para la aplicación.
   - Agrega tu correo como **Usuario de prueba** (Test User).
4. **Crear Credenciales**:
   - Ve a "Credentials" -> "Create Credentials" -> **OAuth client ID**.
   - Tipo de aplicación: **Desktop App**.
   - Descarga el archivo JSON (será tu llaves para `GOOGLE_APPLICATION_CREDENTIALS`).

### Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/eduardouyanez/antigravity-gdrive-mcp.git
   cd antigravity-gdrive-mcp
   ```

2. Instala dependencias:
   ```bash
   npm install
   ```

3. Compila el proyecto:
   ```bash
   npm run build
   ```

### Configuración en Antigravity

Agrega cada una como un servidor independiente en tu archivo `mcp_config.json`:

```json
{
  "mcpServers": {
    "gdrive-work": {
      "command": "node",
      "args": ["RUTA_ABSOLUTA/dist/index.js"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "RUTA_A_LLAVES_TRABAJO.json",
        "MCP_GDRIVE_CREDENTIALS": "RUTA_A_TOKEN_TRABAJO.json"
      }
    },
    "gdrive-personal": {
      "command": "node",
      "args": ["RUTA_ABSOLUTA/dist/index.js"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "RUTA_A_LLAVES_PERSONAL.json",
        "MCP_GDRIVE_CREDENTIALS": "RUTA_A_TOKEN_PERSONAL.json"
      }
    }
  }
}
```

### Autenticación Inicial

Debes generar el token de acceso para cada cuenta ejecutando el comando de autenticación manualmente por primera vez para cada una:

```bash
# Para la cuenta de trabajo (Powershell)
$env:GOOGLE_APPLICATION_CREDENTIALS='path/to/work-keys.json'; $env:MCP_GDRIVE_CREDENTIALS='path/to/work-token.json'; node dist/index.js auth

# Para la cuenta personal (Powershell)
$env:GOOGLE_APPLICATION_CREDENTIALS='path/to/personal-keys.json'; $env:MCP_GDRIVE_CREDENTIALS='path/to/personal-token.json'; node dist/index.js auth
```

### Herramientas Incluidas
- `gdrive_search`: Busca archivos en el Drive conectado.
- `gdrive_read_file`: Lee el contenido de un archivo (convierte Docs a Markdown y Sheets a CSV).
- `gdrive_list_sheets`: Lista las pestañas de un Spreadsheet de Google.

---
Based on the original work by [felores/gdrive-mcp-server](https://github.com/felores/gdrive-mcp-server).
