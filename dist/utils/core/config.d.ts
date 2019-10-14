import { NETWORK } from '../constants';
interface AppConfig {
    readonly version: string;
    readonly minVersion: string;
    readonly protocolVersion: string;
}
interface StorageConfig {
    readonly database: string;
    readonly user: string;
    readonly password: string;
}
interface CacheConfig {
    readonly password: string;
    readonly enabled: boolean;
}
interface ComponentsConfig {
    readonly storage: StorageConfig;
    readonly cache: CacheConfig;
}
export interface PhaetonConfig {
    readonly app: AppConfig;
    readonly components: ComponentsConfig;
}
export declare const defaultPhaetonPath: string;
export declare const defaultPhaetonPm2Path: string;
export declare const defaultPhaetonInstancePath: string;
export declare const defaultBackupPath: string;
export declare const getPhaetonConfig: (installDir: string, network: NETWORK) => Promise<PhaetonConfig>;
export {};
