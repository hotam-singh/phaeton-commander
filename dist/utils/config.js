"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const lockfile_1 = tslib_1.__importDefault(require("lockfile"));
const path_1 = tslib_1.__importDefault(require("path"));
const defaultConfig = tslib_1.__importStar(require("../default_config.json"));
const constants_1 = require("./constants");
const error_1 = require("./error");
const fs_2 = require("./fs");
const configFileName = 'config.json';
const lockfileName = 'config.lock';
const fileWriteErrorMessage = (filePath) => `Could not write to \`${filePath}\`. Your configuration will not be persisted.`;
const attemptCallWithError = (fn, errorMessage) => {
    try {
        return fn();
    }
    catch (_) {
        throw new Error(errorMessage);
    }
};
const attemptToCreateDir = (dirPath) => {
    const fn = fs_1.default.mkdirSync.bind(undefined, dirPath);
    attemptCallWithError(fn, fileWriteErrorMessage(dirPath));
};
const attemptToCreateFile = (filePath) => {
    const fn = fs_2.writeJSONSync.bind(undefined, filePath, defaultConfig);
    attemptCallWithError(fn, fileWriteErrorMessage(filePath));
};
const checkLockfile = (filePath) => {
    const locked = lockfile_1.default.checkSync(filePath);
    const errorMessage = `Config lockfile at ${filePath} found. Are you running Phaeton Commander in another process?`;
    if (locked) {
        throw new Error(errorMessage);
    }
};
const attemptToReadJSONFile = (filePath) => {
    const fn = fs_2.readJSONSync.bind(undefined, filePath);
    const errorMessage = `Config file cannot be read or is not valid JSON. Please check ${filePath} or delete the file so we can create a new one from defaults.`;
    return attemptCallWithError(fn, errorMessage);
};
const attemptToValidateConfig = (config, filePath) => {
    const rootKeys = constants_1.CONFIG_VARIABLES.map(key => key.split('.')[0]);
    const fn = () => {
        rootKeys.forEach(key => {
            if (!Object.keys(config).includes(key)) {
                throw new error_1.ValidationError(`Key ${key} not found in config file.`);
            }
        });
    };
    const errorMessage = `Config file seems to be corrupted: missing required keys. Please check ${filePath} or delete the file so we can create a new one from defaults.`;
    attemptCallWithError(fn, errorMessage);
};
exports.setConfig = (configDirPath, newConfig) => {
    const lockFilePath = path_1.default.join(configDirPath, lockfileName);
    const configFilePath = path_1.default.join(configDirPath, configFileName);
    checkLockfile(lockFilePath);
    lockfile_1.default.lockSync(lockFilePath);
    try {
        fs_2.writeJSONSync(configFilePath, newConfig);
        return true;
    }
    catch (e) {
        return false;
    }
    finally {
        lockfile_1.default.unlockSync(lockFilePath);
    }
};
exports.getConfig = (configDirPath) => {
    if (!fs_1.default.existsSync(configDirPath)) {
        attemptToCreateDir(configDirPath);
    }
    const configFilePath = path_1.default.join(configDirPath, configFileName);
    if (!fs_1.default.existsSync(configFilePath)) {
        attemptToCreateFile(configFilePath);
        return defaultConfig;
    }
    const config = attemptToReadJSONFile(configFilePath);
    attemptToValidateConfig(config, configFilePath);
    return config;
};
//# sourceMappingURL=config.js.map
