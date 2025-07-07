const BASE_URL = 'https://api.openf1.org/v1';
async function fetchLocation(params) {
    const url = new URL(`${BASE_URL}/location`);
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
export const locationTool = {
    definition: {
        name: 'openf1_location',
        description: 'Fetch the approximate 3D location of cars on the circuit at a sample rate of about 3.7 Hz',
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
                x: {
                    type: 'number',
                    description: 'Filter by X coordinate position',
                },
                y: {
                    type: 'number',
                    description: 'Filter by Y coordinate position',
                },
                z: {
                    type: 'number',
                    description: 'Filter by Z coordinate position (elevation)',
                },
                date: {
                    type: 'string',
                    description: 'Filter by date/time (ISO 8601 format or comparison)',
                },
            },
            additionalProperties: true,
        },
    },
    handler: async (args) => {
        try {
            const data = await fetchLocation(args);
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
                        text: `Error fetching location: ${error}`,
                    },
                ],
                isError: true,
            };
        }
    },
};
//# sourceMappingURL=location.js.map