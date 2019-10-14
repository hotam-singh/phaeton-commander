import { APIClient } from '@phaetonhq/phaeton-api-client';
interface APIClientOptions {
    readonly network: string;
    readonly nodes: ReadonlyArray<string>;
}
export declare const getAPIClient: ({ nodes, network, }: APIClientOptions) => APIClient;
export {};
