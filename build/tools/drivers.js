const BASE_URL = 'https://api.openf1.org/v1';
async function fetchDrivers(params) {
    const url = new URL(`${BASE_URL}/drivers`);
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
    return await response.json();
}
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
    },
    handler: async (args) => {
        try {
            const data = await fetchDrivers(args);
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
                        text: `Error fetching drivers: ${error}`,
                    },
                ],
                isError: true,
            };
        }
    },
};
//# sourceMappingURL=drivers.js.map