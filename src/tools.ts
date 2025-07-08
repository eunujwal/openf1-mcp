import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { 
  CarData, Driver, Interval, Lap, Location, Meeting, 
  Pit, Position, RaceControl, Session, Stint, TeamRadio, 
  Weather, QueryParams 
} from './types.js';

const BASE_URL = 'https://api.openf1.org/v1';

// Generic fetch function for all endpoints
async function fetchData<T>(endpoint: string, params: QueryParams): Promise<T[]> {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json() as T[];
}

// Car Data Tool
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
      const data = await fetchData<CarData>('car_data', args);
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Error fetching car data: ${error}` }],
        isError: true,
      };
    }
  },
};

// Drivers Tool
export const driversTool = {
  definition: {
    name: 'openf1_drivers',
    description: 'Fetch information about Formula 1 drivers for each session, including names, teams, and driver numbers',
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
        team_name: {
          type: 'string',
          description: 'Filter by team name (e.g., "Red Bull Racing", "Mercedes", "Ferrari")',
        },
        name_acronym: {
          type: 'string',
          description: 'Filter by driver acronym (e.g., "VER", "HAM", "LEC")',
        },
        country_code: {
          type: 'string',
          description: 'Filter by driver country code (e.g., "NED", "GBR", "MON")',
        },
        first_name: {
          type: 'string',
          description: 'Filter by driver first name',
        },
        last_name: {
          type: 'string',
          description: 'Filter by driver last name',
        },
      },
      additionalProperties: true,
    },
  } as Tool,

  handler: async (args: any) => {
    try {
      const data = await fetchData<Driver>('drivers', args);
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Error fetching drivers: ${error}` }],
        isError: true,
      };
    }
  },
};

// Intervals Tool
export const intervalsTool = {
  definition: {
    name: 'openf1_intervals',
    description: 'Fetch time intervals between drivers during a session',
    inputSchema: {
      type: 'object',
      properties: {
        driver_number: {
          type: 'number',
          description: 'The unique number assigned to an F1 driver',
        },
        session_key: {
          type: 'number',
          description: 'The unique identifier for the session. Use "latest" for current session',
        },
        meeting_key: {
          type: 'number',
          description: 'The unique identifier for the meeting/race weekend. Use "latest" for current meeting',
        },
        date: {
          type: 'string',
          description: 'Filter by date/time (ISO 8601 format)',
        },
      },
      additionalProperties: true,
    },
  } as Tool,

  handler: async (args: any) => {
    try {
      const data = await fetchData<Interval>('intervals', args);
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Error fetching intervals: ${error}` }],
        isError: true,
      };
    }
  },
};

// Laps Tool
export const lapsTool = {
  definition: {
    name: 'openf1_laps',
    description: 'Fetch lap times and sector information for drivers',
    inputSchema: {
      type: 'object',
      properties: {
        driver_number: {
          type: 'number',
          description: 'The unique number assigned to an F1 driver',
        },
        session_key: {
          type: 'number',
          description: 'The unique identifier for the session. Use "latest" for current session',
        },
        meeting_key: {
          type: 'number',
          description: 'The unique identifier for the meeting/race weekend. Use "latest" for current meeting',
        },
        lap_number: {
          type: 'number',
          description: 'Filter by specific lap number',
        },
        is_pit_out_lap: {
          type: 'boolean',
          description: 'Filter by pit out lap status',
        },
        date_start: {
          type: 'string',
          description: 'Filter by lap start date/time (ISO 8601 format)',
        },
      },
      additionalProperties: true,
    },
  } as Tool,

  handler: async (args: any) => {
    try {
      const data = await fetchData<Lap>('laps', args);
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Error fetching laps: ${error}` }],
        isError: true,
      };
    }
  },
};

// Location Tool
export const locationTool = {
  definition: {
    name: 'openf1_location',
    description: 'Fetch driver position data (x, y, z coordinates) on the track',
    inputSchema: {
      type: 'object',
      properties: {
        driver_number: {
          type: 'number',
          description: 'The unique number assigned to an F1 driver',
        },
        session_key: {
          type: 'number',
          description: 'The unique identifier for the session. Use "latest" for current session',
        },
        meeting_key: {
          type: 'number',
          description: 'The unique identifier for the meeting/race weekend. Use "latest" for current meeting',
        },
        date: {
          type: 'string',
          description: 'Filter by date/time (ISO 8601 format)',
        },
      },
      additionalProperties: true,
    },
  } as Tool,

  handler: async (args: any) => {
    try {
      const data = await fetchData<Location>('location', args);
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Error fetching location: ${error}` }],
        isError: true,
      };
    }
  },
};

// Meetings Tool
export const meetingsTool = {
  definition: {
    name: 'openf1_meetings',
    description: 'Fetch information about F1 race meetings/events',
    inputSchema: {
      type: 'object',
      properties: {
        meeting_key: {
          type: 'number',
          description: 'The unique identifier for the meeting/race weekend. Use "latest" for current meeting',
        },
        year: {
          type: 'number',
          description: 'Filter by year (e.g., 2023, 2024)',
        },
        country_code: {
          type: 'string',
          description: 'Filter by country code (e.g., "GBR", "ITA", "MON")',
        },
        circuit_short_name: {
          type: 'string',
          description: 'Filter by circuit short name (e.g., "silverstone", "monza", "monaco")',
        },
        date_start: {
          type: 'string',
          description: 'Filter by meeting start date (ISO 8601 format)',
        },
      },
      additionalProperties: true,
    },
  } as Tool,

  handler: async (args: any) => {
    try {
      const data = await fetchData<Meeting>('meetings', args);
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Error fetching meetings: ${error}` }],
        isError: true,
      };
    }
  },
};

// Pit Tool
export const pitTool = {
  definition: {
    name: 'openf1_pit',
    description: 'Fetch pit stop information for drivers',
    inputSchema: {
      type: 'object',
      properties: {
        driver_number: {
          type: 'number',
          description: 'The unique number assigned to an F1 driver',
        },
        session_key: {
          type: 'number',
          description: 'The unique identifier for the session. Use "latest" for current session',
        },
        meeting_key: {
          type: 'number',
          description: 'The unique identifier for the meeting/race weekend. Use "latest" for current meeting',
        },
        lap_number: {
          type: 'number',
          description: 'Filter by specific lap number',
        },
        date: {
          type: 'string',
          description: 'Filter by date/time (ISO 8601 format)',
        },
      },
      additionalProperties: true,
    },
  } as Tool,

  handler: async (args: any) => {
    try {
      const data = await fetchData<Pit>('pit', args);
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Error fetching pit data: ${error}` }],
        isError: true,
      };
    }
  },
};

// Position Tool
export const positionTool = {
  definition: {
    name: 'openf1_position',
    description: 'Fetch driver position/ranking data during sessions',
    inputSchema: {
      type: 'object',
      properties: {
        driver_number: {
          type: 'number',
          description: 'The unique number assigned to an F1 driver',
        },
        session_key: {
          type: 'number',
          description: 'The unique identifier for the session. Use "latest" for current session',
        },
        meeting_key: {
          type: 'number',
          description: 'The unique identifier for the meeting/race weekend. Use "latest" for current meeting',
        },
        position: {
          type: 'number',
          description: 'Filter by specific position',
        },
        date: {
          type: 'string',
          description: 'Filter by date/time (ISO 8601 format)',
        },
      },
      additionalProperties: true,
    },
  } as Tool,

  handler: async (args: any) => {
    try {
      const data = await fetchData<Position>('position', args);
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Error fetching position: ${error}` }],
        isError: true,
      };
    }
  },
};

// Race Control Tool
export const raceControlTool = {
  definition: {
    name: 'openf1_race_control',
    description: 'Fetch race control messages and flags',
    inputSchema: {
      type: 'object',
      properties: {
        driver_number: {
          type: 'number',
          description: 'The unique number assigned to an F1 driver',
        },
        session_key: {
          type: 'number',
          description: 'The unique identifier for the session. Use "latest" for current session',
        },
        meeting_key: {
          type: 'number',
          description: 'The unique identifier for the meeting/race weekend. Use "latest" for current meeting',
        },
        category: {
          type: 'string',
          description: 'Filter by message category',
        },
        flag: {
          type: 'string',
          description: 'Filter by flag type',
        },
        scope: {
          type: 'string',
          description: 'Filter by message scope',
        },
        date: {
          type: 'string',
          description: 'Filter by date/time (ISO 8601 format)',
        },
      },
      additionalProperties: true,
    },
  } as Tool,

  handler: async (args: any) => {
    try {
      const data = await fetchData<RaceControl>('race_control', args);
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Error fetching race control: ${error}` }],
        isError: true,
      };
    }
  },
};

// Sessions Tool
export const sessionsTool = {
  definition: {
    name: 'openf1_sessions',
    description: 'Fetch information about F1 sessions (practice, qualifying, race)',
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
        session_type: {
          type: 'string',
          description: 'Filter by session type (e.g., "Practice", "Qualifying", "Race")',
        },
        year: {
          type: 'number',
          description: 'Filter by year (e.g., 2023, 2024)',
        },
        date_start: {
          type: 'string',
          description: 'Filter by session start date (ISO 8601 format)',
        },
      },
      additionalProperties: true,
    },
  } as Tool,

  handler: async (args: any) => {
    try {
      const data = await fetchData<Session>('sessions', args);
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Error fetching sessions: ${error}` }],
        isError: true,
      };
    }
  },
};

// Stints Tool
export const stintsTool = {
  definition: {
    name: 'openf1_stints',
    description: 'Fetch tire stint information for drivers',
    inputSchema: {
      type: 'object',
      properties: {
        driver_number: {
          type: 'number',
          description: 'The unique number assigned to an F1 driver',
        },
        session_key: {
          type: 'number',
          description: 'The unique identifier for the session. Use "latest" for current session',
        },
        meeting_key: {
          type: 'number',
          description: 'The unique identifier for the meeting/race weekend. Use "latest" for current meeting',
        },
        compound: {
          type: 'string',
          description: 'Filter by tire compound (e.g., "soft", "medium", "hard", "intermediate", "wet")',
        },
        stint_number: {
          type: 'number',
          description: 'Filter by specific stint number',
        },
      },
      additionalProperties: true,
    },
  } as Tool,

  handler: async (args: any) => {
    try {
      const data = await fetchData<Stint>('stints', args);
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Error fetching stints: ${error}` }],
        isError: true,
      };
    }
  },
};

// Team Radio Tool
export const teamRadioTool = {
  definition: {
    name: 'openf1_team_radio',
    description: 'Fetch team radio messages and recordings',
    inputSchema: {
      type: 'object',
      properties: {
        driver_number: {
          type: 'number',
          description: 'The unique number assigned to an F1 driver',
        },
        session_key: {
          type: 'number',
          description: 'The unique identifier for the session. Use "latest" for current session',
        },
        meeting_key: {
          type: 'number',
          description: 'The unique identifier for the meeting/race weekend. Use "latest" for current meeting',
        },
        date: {
          type: 'string',
          description: 'Filter by date/time (ISO 8601 format)',
        },
      },
      additionalProperties: true,
    },
  } as Tool,

  handler: async (args: any) => {
    try {
      const data = await fetchData<TeamRadio>('team_radio', args);
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Error fetching team radio: ${error}` }],
        isError: true,
      };
    }
  },
};

// Weather Tool
export const weatherTool = {
  definition: {
    name: 'openf1_weather',
    description: 'Fetch weather data during F1 sessions',
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
          description: 'Filter by air temperature (Celsius)',
        },
        track_temperature: {
          type: 'number',
          description: 'Filter by track temperature (Celsius)',
        },
        humidity: {
          type: 'number',
          description: 'Filter by humidity percentage',
        },
        rainfall: {
          type: 'number',
          description: 'Filter by rainfall amount',
        },
        wind_speed: {
          type: 'number',
          description: 'Filter by wind speed',
        },
        date: {
          type: 'string',
          description: 'Filter by date/time (ISO 8601 format)',
        },
      },
      additionalProperties: true,
    },
  } as Tool,

  handler: async (args: any) => {
    try {
      const data = await fetchData<Weather>('weather', args);
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `Error fetching weather: ${error}` }],
        isError: true,
      };
    }
  },
}; 