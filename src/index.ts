#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

// Import all tool handlers
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

class OpenF1MCPServer {
  private server: Server;

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

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('OpenF1 MCP server running on stdio');
  }
}

const server = new OpenF1MCPServer();
server.run().catch(console.error);