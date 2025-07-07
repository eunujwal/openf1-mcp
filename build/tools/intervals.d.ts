import { Tool } from '@modelcontextprotocol/sdk/types.js';
export declare const intervalsTool: {
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
//# sourceMappingURL=intervals.d.ts.map