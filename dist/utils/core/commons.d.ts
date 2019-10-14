import { NETWORK } from '../constants';
export declare const phaetonInstall: (installPath: string) => string;
export declare const installDirectory: (installPath: string, name: string) => string;
export declare const phaetonVersion: (version: string) => string;
export declare const phaetonTar: (version: string) => string;
export declare const phaetonTarSHA256: (version: string) => string;
export declare const phaetonLatestUrl: (url: string, network: NETWORK) => string;
export declare const phaetonSnapshotUrl: (url: string, network: NETWORK) => string;
export declare const logsDir: (installPath: string) => string;
export declare const SH_LOG_FILE = "logs/phaeton.out";
export declare const validateNotARootUser: () => void;
export declare const isSupportedOS: () => boolean;
export declare const validateNetwork: (network: NETWORK) => void;
export declare const createDirectory: (dirPath: string) => void;
export declare const validURL: (url: string) => void;
export declare const getSemver: (str: string) => string;
export declare const getVersionToInstall: (network: NETWORK, version?: string | undefined, releaseUrl?: string | undefined) => Promise<string>;
export declare const backupPhaeton: (installDir: string, instanceName: string) => void;
export declare const upgradePhaeton: (installDir: string, name: string, network: NETWORK, currentVersion: string) => Promise<void>;
export declare const validateVersion: (releaseUrl: string, version: string) => Promise<void>;
export declare const dateDiff: (date1: Date, date2: Date) => number;
interface FileInfo {
    readonly fileName: string;
    readonly fileDir: string;
    readonly filePath: string;
}
export declare const getDownloadedFileInfo: (url: string, cacheDir: string) => FileInfo;
export declare const generateEnvConfig: (network: NETWORK) => Promise<object>;
export {};
