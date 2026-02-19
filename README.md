# Antigravity Google Drive MCP Server (Multi-Account Support)

Este es un servidor MCP (Model Context Protocol) diseñado para conectar **Antigravity** (u otros clientes MCP) con múltiples cuentas de Google Drive simultáneamente.

A diferencia de la versión original, esta implementación permite parametrizar las rutas de las credenciales mediante variables de entorno, lo que facilita ejecutar varias instancias (ej: Trabajo y Personal) sin que entren en conflicto.

## Características
- **Multi-cuenta**: Registra tantos servidores como necesites en tu `mcp_config.json`.
- **Soporte de Google Sheets**: Incluye herramientas para listar pestañas de hojas de cálculo.
- **Configuración mediante Env Vars**: No más rutas fijas; tú decides dónde guardar tus llaves.

## Requisitos Previos (Google Cloud)

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

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/TU_USUARIO/antigravity-gdrive-mcp.git
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

## Configuración en Antigravity

Para usar múltiples cuentas, agrega cada una como un servidor independiente en tu archivo `mcp_config.json`:

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

## Autenticación Inicial

Debes generar el token de acceso para cada cuenta ejecutando el comando de autenticación manualmente por primera vez para cada una:

```bash
# Para la cuenta de trabajo
$env:GOOGLE_APPLICATION_CREDENTIALS='path/to/work-keys.json'; $env:MCP_GDRIVE_CREDENTIALS='path/to/work-token.json'; node dist/index.js auth

# Para la cuenta personal
$env:GOOGLE_APPLICATION_CREDENTIALS='path/to/personal-keys.json'; $env:MCP_GDRIVE_CREDENTIALS='path/to/personal-token.json'; node dist/index.js auth
```

## Herramientas Incluidas
- `gdrive_search`: Busca archivos en el Drive conectado.
- `gdrive_read_file`: Lee el contenido de un archivo (convierte Docs a Markdown y Sheets a CSV).
- `gdrive_list_sheets`: Lista las pestañas de un Spreadsheet de Google.

---
Basado en el trabajo original de [felores/gdrive-mcp-server](https://github.com/felores/gdrive-mcp-server).
