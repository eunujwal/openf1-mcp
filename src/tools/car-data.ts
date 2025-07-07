import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { CarData, QueryParams } from '../types.js';

const BASE_URL = 'https://api.openf1.org/v1';

async function fetchCarData(params: QueryParams): Promise<CarData[]> {
  const url = new URL(`${BASE_URL}/car_data`);
  
  // Add query parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json() as CarData[];
}

export const carDataTool = {
  definition: {
    name: 'openf1_car_data',
    description: 'Fetch Formula 1 car telemetry data including speed, throttle, brake, DRS, RPM, and gear information at a sample rate of about 3.7 Hz',
    inputSchema: {
      type: 'object',
      properties: {
        driver_number: {
          type: 'number',
          description: 'The unique number assigned to an F1 driver (e.g., 1 for Verstappen, 44 for Hamilton)',
        },
        session_key: {
          type: 'number', 
          description: 'The unique identifier for the session. Use "latest" for current session',
        },
        meeting_key: {
          type: 'number',
          description: 'The unique identifier for the meeting/race weekend. Use "latest" for current meeting',
        },
        speed: {
          type: 'number',
          description: 'Filter by speed (km/h). Use comparison operators like >=315',
        },
        brake: {
          type: 'number',
          description: 'Filter by brake status (0 = not pressed, 100 = pressed)',
        },
        throttle: {
          type: 'number',
          description: 'Filter by throttle percentage (0-100)',
        },
        drs: {
          type: 'number',
          description: 'Filter by DRS status (0=off, 8=eligible, 10/12/14=on)',
        },
        n_gear: {
          type: 'number',
          description: 'Filter by gear number (0=neutral, 1-8=gears)',
        },
        rpm: {
          type: 'number',
          description: 'Filter by engine RPM',
        },
        date: {
          type: 'string',
          description: 'Filter by date/time (ISO 8601 format or comparison like >2023-09-15T13:00:00)',
        },
      },
      additionalProperties: true,
    },
  } as Tool,

  handler: async (args: any) => {
    try {
      const data = await fetchCarData(args);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error fetching car data: ${error}`,
          },
        ],
        isError: true,
      };
    }
  },
};