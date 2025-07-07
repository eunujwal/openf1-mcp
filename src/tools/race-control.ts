import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { RaceControl, QueryParams } from '../types.js';

const BASE_URL = 'https://api.openf1.org/v1';

async function fetchRaceControl(params: QueryParams): Promise<RaceControl[]> {
  const url = new URL(`${BASE_URL}/race_control`);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json() as RaceControl[];
}

export const raceControlTool = {
  definition: {
    name: 'openf1_race_control',
    description: 'Fetch information about race control events including racing incidents, flags, safety car, and penalties',
    inputSchema: {
      type: 'object',
      properties: {
        session_key: {
          type: 'number',
          description: 'The unique identifier for the session. Use "latest" for current session',
        },
        meeting_key: {
          type: 'number',
          description: 'The unique identifier for the meeting/race weekend. Use "latest" for current meeting',
        },
        driver_number: {
          type: 'number',
          description: 'The unique number assigned to an F1 driver (e.g., 1 for Verstappen, 44 for Hamilton)',
        },
        category: {
          type: 'string',
          description: 'Filter by event category (e.g., "Flag", "CarEvent", "Drs", "SafetyCar")',
        },
        flag: {
          type: 'string',
          description: 'Filter by flag type (e.g., "BLACK AND WHITE", "YELLOW", "GREEN", "CHEQUERED")',
        },
      },
      additionalProperties: true,
    },
  } as Tool,

  handler: async (args: any) => {
    try {
      const data = await fetchRaceControl(args);
      
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
            text: `Error fetching race_control: ${error}`,
          },
        ],
        isError: true,
      };
    }
  },
}; 