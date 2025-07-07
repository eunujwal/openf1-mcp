const BASE_URL = 'https://api.openf1.org/v1';
async function fetchStints(params) {
    const url = new URL(`${BASE_URL}/stints`);
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
export const stintsTool = {
    definition: {
        name: 'openf1_stints',
        description: 'Fetch information about individual stints (periods of continuous driving) including tyre compounds',
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
                stint_number: {
                    type: 'number',
                    description: 'Filter by stint number (1, 2, 3, etc.)',
                },
                compound: {
                    type: 'string',
                    description: 'Filter by tyre compound (e.g., "SOFT", "MEDIUM", "HARD")',
                },
                tyre_age_at_start: {
                    type: 'number',
                    description: 'Filter by tyre age at start of stint (use comparison operators like >=3)',
                },
            },
            additionalProperties: true,
        },
    },
    handler: async (args) => {
        try {
            const data = await fetchStints(args);
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
                        text: `Error fetching stints: ${error}`,
                    },
                ],
                isError: true,
            };
        }
    },
};
//# sourceMappingURL=stints.js.map