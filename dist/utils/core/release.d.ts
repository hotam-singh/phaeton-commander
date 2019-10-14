import { NETWORK } from '../constants';
export declare const getLatestVersion: (url: string) => Promise<string>;
export interface ReleaseInfo {
    readonly phaetonTarSHA256Url: string;
    readonly phaetonTarUrl: string;
    readonly version: string;
}
export declare const getReleaseInfo: (releaseUrl: string, network?: NETWORK | undefined, installVersion?: string | undefined) => Promise<ReleaseInfo>;
