#!/usr/bin/env node

import express from 'express';
import cors from 'cors';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

// Import all your existing tools (same as index.ts)
import { carDataTool } from './tools/car-data.js';
import { driversTool } from './tools/drivers.js';
import { intervalsTool } from './tools/intervals.js';
import { lapsTool } from './tools/laps.js';
import { locationTool } from './tools/location.js';
import { meetingsTool } from './tools/meetings.js';
import { pitTool } from './tools/pit.js';
import { positionTool } from './tools/position.js';
import { raceControlTool } from './tools/race-control.js';
import { sessionsTool } from './tools/sessions.js';
import { stintsTool } from './tools/stints.js';
import { teamRadioTool } from './tools/team-radio.js';
import { weatherTool } from './tools/weather.js';

class OpenF1HTTPServer {
  private app: express.Application;
  private server: Server;

  constructor() {
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());

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

    this.setupMCPHandlers();
    this.setupRoutes();
  }

  private setupMCPHandlers(): void {
    // Copy the exact same handlers from your index.ts
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

  private setupRoutes(): void {
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

  public async start(): Promise<void> {
    const port = process.env.PORT || 3000;
    const host = process.env.HOST || '0.0.0.0';
    
    return new Promise((resolve) => {
      this.app.listen(port, host, () => {
        console.log(`OpenF1 MCP HTTP Server running on http://${host}:${port}`);
        console.log(`MCP SSE endpoint: /sse`);
        console.log(`Health check: /health`);
        resolve();
      });
    });
  }
}

const server = new OpenF1HTTPServer();
server.start().catch(console.error);