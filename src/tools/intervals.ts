import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { Interval, QueryParams } from '../types.js';

const BASE_URL = 'https://api.openf1.org/v1';

async function fetchIntervals(params: QueryParams): Promise<Interval[]> {
  const url = new URL(`${BASE_URL}/intervals`);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json() as Interval[];
}

export const intervalsTool = {
  definition: {
    name: 'openf1_intervals',
    description: 'Fetch real-time interval data between drivers and their gap to the race leader',
    inputSchema: {
      type: 'object',
      properties: {
        session_key: {
          type: 'number',
          description: 'The unique identifier for the session',
        },
      },
      additionalProperties: true,
    },
  } as Tool,

  handler: async (args: any) => {
    try {
      const data = await fetchIntervals(args);
      
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
            text: `Error fetching intervals: ${error}`,
          },
        ],
        isError: true,
      };
    }
  },
};