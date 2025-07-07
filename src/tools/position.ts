import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { Position, QueryParams } from '../types.js';

const BASE_URL = 'https://api.openf1.org/v1';

async function fetchPosition(params: QueryParams): Promise<Position[]> {
  const url = new URL(`${BASE_URL}/position`);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json() as Position[];
}

export const positionTool = {
  definition: {
    name: 'openf1_position',
    description: 'Fetch driver positions throughout a session, including initial placement and subsequent changes',
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
        position: {
          type: 'number',
          description: 'Filter by position (1-20, use comparison operators like <=3 for podium positions)',
        },
      },
      additionalProperties: true,
    },
  } as Tool,

  handler: async (args: any) => {
    try {
      const data = await fetchPosition(args);
      
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
            text: `Error fetching position: ${error}`,
          },
        ],
        isError: true,
      };
    }
  },
}; 