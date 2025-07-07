import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { TeamRadio, QueryParams } from '../types.js';

const BASE_URL = 'https://api.openf1.org/v1';

async function fetchTeamRadio(params: QueryParams): Promise<TeamRadio[]> {
  const url = new URL(`${BASE_URL}/team_radio`);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json() as TeamRadio[];
}

export const teamRadioTool = {
  definition: {
    name: 'openf1_team_radio',
    description: 'Fetch radio exchanges between Formula 1 drivers and their teams during sessions',
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
        date: {
          type: 'string',
          description: 'Filter by date/time (ISO 8601 format or comparison)',
        },
      },
      additionalProperties: true,
    },
  } as Tool,

  handler: async (args: any) => {
    try {
      const data = await fetchTeamRadio(args);
      
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
            text: `Error fetching team_radio: ${error}`,
          },
        ],
        isError: true,
      };
    }
  },
}; 