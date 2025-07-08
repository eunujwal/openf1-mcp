#!/usr/bin/env node

import express from 'express';
import cors from 'cors';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

// Import all tools from the consolidated tools file
import { 
  carDataTool, driversTool, intervalsTool, lapsTool, locationTool,
  meetingsTool, pitTool, positionTool, raceControlTool, sessionsTool,
  stintsTool, teamRadioTool, weatherTool 
} from './tools.js';

class OpenF1MCPServer {
  private server: Server;
  private app?: express.Application;

  constructor() {
    this.server = new Server(
      {
        name: 'openf1-mcp',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers(): void {
    // List tools handler
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          carDataTool.definition,
          driversTool.definition,
          intervalsTool.definition,
          lapsTool.definition,
          locationTool.definition,
          meetingsTool.definition,
          pitTool.definition,
          positionTool.definition,
          raceControlTool.definition,
          sessionsTool.definition,
          stintsTool.definition,
          teamRadioTool.definition,
          weatherTool.definition,
        ],
      };
    });

    // Call tool handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'openf1_car_data':
            return await carDataTool.handler(args || {});
          case 'openf1_drivers':  
            return await driversTool.handler(args || {});
          case 'openf1_intervals':
            return await intervalsTool.handler(args || {});
          case 'openf1_laps':
            return await lapsTool.handler(args || {});
          case 'openf1_location':
            return await locationTool.handler(args || {});
          case 'openf1_meetings':
            return await meetingsTool.handler(args || {});
          case 'openf1_pit':
            return await pitTool.handler(args || {});
          case 'openf1_position':
            return await positionTool.handler(args || {});
          case 'openf1_race_control':
            return await raceControlTool.handler(args || {});
          case 'openf1_sessions': 
            return await sessionsTool.handler(args || {});
          case 'openf1_stints':
            return await stintsTool.handler(args || {});
          case 'openf1_team_radio':
            return await teamRadioTool.handler(args || {});
          case 'openf1_weather':
            return await weatherTool.handler(args || {});
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          `Error executing tool ${name}: ${error}`
        );
      }
    });
  }

  // Stdio server mode
  async runStdio(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('OpenF1 MCP server running on stdio');
  }

  // HTTP server mode
  async runHttp(): Promise<void> {
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());

    this.setupHttpRoutes();

    const port = parseInt(process.env.PORT || '3000', 10);
    const host = process.env.HOST || '0.0.0.0';
    
    return new Promise((resolve) => {
      this.app!.listen(port, host, () => {
        console.log(`OpenF1 MCP HTTP Server running on http://${host}:${port}`);
        console.log(`MCP SSE endpoint: /sse`);
        console.log(`Health check: /health`);
        resolve();
      });
    });
  }

  private setupHttpRoutes(): void {
    if (!this.app) return;

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'OpenF1 MCP Server'
      });
    });

    // MCP SSE endpoint
    this.app.get('/sse', async (req, res) => {
      const transport = new SSEServerTransport('/sse', res);
      await this.server.connect(transport);
    });

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        name: 'OpenF1 MCP Server',
        version: '0.1.0',
        endpoints: {
          health: '/health',
          mcp: '/sse'
        }
      });
    });
  }
}

// Main execution logic
async function main() {
  const args = process.argv.slice(2);
  const server = new OpenF1MCPServer();

  if (args.includes('--http') || args.includes('-h')) {
    await server.runHttp();
  } else {
    await server.runStdio();
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { OpenF1MCPServer }; 