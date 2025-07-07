import { Tool } from '@modelcontextprotocol/sdk/types.js';
export declare const positionTool: {
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
//# sourceMappingURL=position.d.ts.map