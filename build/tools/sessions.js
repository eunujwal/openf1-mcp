const BASE_URL = 'https://api.openf1.org/v1';
async function fetchSessions(params) {
    const url = new URL(`${BASE_URL}/sessions`);
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
export const sessionsTool = {
    definition: {
        name: 'openf1_sessions',
        description: 'Fetch information about Formula 1 sessions (practice, qualifying, sprint, race)',
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
                country_name: {
                    type: 'string',
                    description: 'Filter by country name (e.g., "Belgium", "Singapore", "Monaco")',
                },
                session_name: {
                    type: 'string',
                    description: 'Filter by session name (e.g., "Practice 1", "Qualifying", "Sprint", "Race")',
                },
                year: {
                    type: 'number',
                    description: 'Filter by year (e.g., 2023, 2024)',
                },
            },
            additionalProperties: true,
        },
    },
    handler: async (args) => {
        try {
            const data = await fetchSessions(args);
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
                        text: `Error fetching sessions: ${error}`,
                    },
                ],
                isError: true,
            };
        }
    },
};
//# sourceMappingURL=sessions.js.map