const BASE_URL = 'https://api.openf1.org/v1';
async function fetchLaps(params) {
    const url = new URL(`${BASE_URL}/laps`);
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
    return data;
}
export const lapsTool = {
    definition: {
        name: 'openf1_laps',
        description: 'Fetch detailed information about individual laps including sector times, speeds, and lap duration',
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
                lap_number: {
                    type: 'number',
                    description: 'Filter by specific lap number',
                },
                lap_duration: {
                    type: 'number',
                    description: 'Filter by lap duration in seconds (use comparison operators like >=120)',
                },
                is_pit_out_lap: {
                    type: 'boolean',
                    description: 'Filter for pit out laps (true/false)',
                },
                duration_sector_1: {
                    type: 'number',
                    description: 'Filter by sector 1 duration in seconds',
                },
                duration_sector_2: {
                    type: 'number',
                    description: 'Filter by sector 2 duration in seconds',
                },
                duration_sector_3: {
                    type: 'number',
                    description: 'Filter by sector 3 duration in seconds',
                },
                i1_speed: {
                    type: 'number',
                    description: 'Filter by intermediate 1 speed in km/h',
                },
                i2_speed: {
                    type: 'number',
                    description: 'Filter by intermediate 2 speed in km/h',
                },
                st_speed: {
                    type: 'number',
                    description: 'Filter by speed trap speed in km/h',
                },
                date_start: {
                    type: 'string',
                    description: 'Filter by lap start date/time (ISO 8601 format)',
                },
            },
            additionalProperties: true,
        },
    },
    handler: async (args) => {
        try {
            const data = await fetchLaps(args);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(data, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error fetching laps: ${error}`,
                    },
                ],
                isError: true,
            };
        }
    },
};
//# sourceMappingURL=laps.js.map