import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { Meeting, QueryParams } from '../types.js';

const BASE_URL = 'https://api.openf1.org/v1';

async function fetchMeetings(params: QueryParams): Promise<Meeting[]> {
  const url = new URL(`${BASE_URL}/meetings`);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json() as Meeting[];
}

export const meetingsTool = {
  definition: {
    name: 'openf1_meetings',
    description: 'Fetch information about Formula 1 meetings (Grand Prix or testing weekends)',
    inputSchema: {
      type: 'object',
      properties: {
        meeting_key: {
          type: 'number',
          description: 'The unique identifier for the meeting. Use "latest" for current meeting',
        },
        year: {
          type: 'number',
          description: 'Filter by year (e.g., 2023, 2024)',
        },
        country_name: {
          type: 'string',
          description: 'Filter by country name (e.g., "Singapore", "Belgium", "Monaco")',
        },
        country_code: {
          type: 'string',
          description: 'Filter by country code (e.g., "SGP", "BEL", "MON")',
        },
        circuit_short_name: {
          type: 'string',
          description: 'Filter by circuit name (e.g., "Singapore", "Spa-Francorchamps", "Monaco")',
        },
      },
      additionalProperties: true,
    },
  } as Tool,

  handler: async (args: any) => {
    try {
      const data = await fetchMeetings(args);
      
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
            text: `Error fetching meetings: ${error}`,
          },
        ],
        isError: true,
      };
    }
  },
};