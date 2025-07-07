import { Tool } from '@modelcontextprotocol/sdk/types.js';
export declare const sessionsTool: {
    definition: Tool;
    handler: (args: any) => Promise<{
        content: {
            type: string;
            text: string;
        }[];
        isError?: undefined;
    } | {
        content: {
            type: string;
            text: string;
        }[];
        isError: boolean;
    }>;
};
//# sourceMappingURL=sessions.d.ts.map