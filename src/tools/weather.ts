import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { Weather, QueryParams } from '../types.js';

const BASE_URL = 'https://api.openf1.org/v1';

async function fetchWeather(params: QueryParams): Promise<Weather[]> {
  const url = new URL(`${BASE_URL}/weather`);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  return data as Weather[];
}

export const weatherTool = {
  definition: {
    name: 'openf1_weather',
    description: 'Fetch weather information over the track, updated every minute including temperature, humidity, wind, and rainfall data',
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
        air_temperature: {
          type: 'number',
          description: 'Filter by air temperature in Celsius (use comparison operators like >=27.8)',
        },
        track_temperature: {
          type: 'number',
          description: 'Filter by track temperature in Celsius (use comparison operators like >=52)',
        },
        humidity: {
          type: 'number',
          description: 'Filter by relative humidity percentage (0-100)',
        },
        pressure: {
          type: 'number',
          description: 'Filter by air pressure in mbar',
        },
        rainfall: {
          type: 'number',
          description: 'Filter by rainfall (0 = no rain, >0 = rain)',
        },
        wind_speed: {
          type: 'number',
          description: 'Filter by wind speed in m/s',
        },
        wind_direction: {
          type: 'number',
          description: 'Filter by wind direction in degrees (0-359, use comparison operators like >=130)',
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
      const data = await fetchWeather(args);
      
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
            text: `Error fetching weather: ${error}`,
          },
        ],
        isError: true,
      };
    }
  },
};