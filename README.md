# OpenF1 MCP

Model Context Protocol server for OpenF1 Formula 1 API, you can check the API specs here: https://openf1.org/

This package provides a Python wrapper around a TypeScript-based MCP server for accessing Formula 1 data through the OpenF1 API.

## Installation

### Prerequisites

- Python 3.7 or higher
- Node.js 18 or higher

### Install via pip

```bash
pip install openf1-mcp
```

### Install from source

```bash
git clone https://github.com/eunujwal/openf1-mcp.git
cd openf1-mcp
npm install
npm run build
pip install -e .
```

## Usage

### Option 1: Remote Server (Recommended)

Use the pre-deployed remote MCP server (no installation required):

**MCP Endpoint**: `https://openf1-mcp.onrender.com/sse`

Configure in Claude Desktop:
```json
{
  "mcpServers": {
    "openf1": {
      "command": "npx",
      "args": ["@modelcontextprotocol/create-mcp", "client", "https://openf1-mcp.onrender.com/sse"]
    }
  }
}
```

Or use with MCP Inspector:
```bash
npx @modelcontextprotocol/inspector https://openf1-mcp.onrender.com/sse
```

### Option 2: Local Installation

#### Command Line Interface

Run the MCP server in stdio mode (default):
```bash
openf1-mcp
```

Run the MCP server in HTTP mode:
```bash
openf1-mcp --http
```

### Python API

```python
from openf1_mcp import OpenF1MCPServer

# Start the server in stdio mode
with OpenF1MCPServer() as server:
    process = server.start_stdio_server()
    # The server is now running and can be used by MCP clients
    
# Start the server in HTTP mode
with OpenF1MCPServer() as server:
    process = server.start_http_server(port=3000)
    # The server is now running on http://localhost:3000
```

## Available Tools

The MCP server provides the following tools for accessing Formula 1 data:

- `openf1_car_data` - Fetch car telemetry data (speed, throttle, brake, DRS, RPM, gear)
- `openf1_drivers` - Get driver information
- `openf1_intervals` - Get time intervals between drivers
- `openf1_laps` - Get lap times and lap data
- `openf1_location` - Get track location data
- `openf1_meetings` - Get race meeting information
- `openf1_pit` - Get pit stop data
- `openf1_position` - Get driver positions
- `openf1_race_control` - Get race control messages
- `openf1_sessions` - Get session information
- `openf1_stints` - Get stint data
- `openf1_team_radio` - Get team radio messages
- `openf1_weather` - Get weather data

## Deployment

The server includes configuration files for easy deployment to various platforms:

### Render (Current deployment)
- Uses `render.yaml` configuration
- Automatically deploys from GitHub
- Available at: https://openf1-mcp.onrender.com

### Railway
- Uses `railway.toml` configuration
- Run: `railway up`

### Docker
- Uses included `Dockerfile`
- Build: `docker build -t openf1-mcp .`
- Run: `docker run -p 3000:3000 openf1-mcp`

## Development

### Building the TypeScript code

```bash
npm install
npm run build
```

### Running in development mode

```bash
npm run dev  # TypeScript watch mode
```

### Testing

```bash
npm test
```

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request
