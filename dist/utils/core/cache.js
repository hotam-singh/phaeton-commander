"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_process_1 = require("../worker-process");
const config_1 = require("./config");
const pm2_1 = require("./pm2");
const CACHE_START_SUCCESS = '[+] Redis-Server started successfully.';
const CACHE_START_FAILURE = '[-] Failed to start Redis-Server.';
const CACHE_STOP_SUCCESS = '[+] Redis-Server stopped successfully.';
const CACHE_STOP_FAILURE = '[-] Failed to stop Redis-Server.';
const REDIS_CONFIG = 'etc/redis.conf';
const REDIS_BIN = './bin/redis-server';
const REDIS_CLI = './bin/redis-cli';
exports.isCacheRunning = async (installDir, name) => {
    const { redisPort } = (await pm2_1.describeApplication(name));
    const { stderr } = await worker_process_1.exec(`${REDIS_CLI} -p ${redisPort} ping`, { cwd: installDir });
    return !stderr;
};
exports.startCache = async (installDir, name) => {
    const { redisPort } = (await pm2_1.describeApplication(name));
    const { stderr } = await worker_process_1.exec(`${REDIS_BIN} ${REDIS_CONFIG} --port ${redisPort}`, { cwd: installDir });
    if (!stderr) {
        return CACHE_START_SUCCESS;
    }
    throw new Error(`${CACHE_START_FAILURE}: \n\n ${stderr}`);
};
const stopCommand = async (installDir, network, name) => {
    try {
        const { components: { cache: { password }, }, } = await config_1.getPhaetonConfig(installDir, network);
        const { redisPort } = (await pm2_1.describeApplication(name));
        if (password) {
            return `${REDIS_CLI} -p ${redisPort} -a ${password} shutdown`;
        }
        return `${REDIS_CLI} -p ${redisPort} shutdown`;
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.stopCache = async (installDir, network, name) => {
    try {
        const cmd = await stopCommand(installDir, network, name);
        const { stderr } = await worker_process_1.exec(cmd, { cwd: installDir });
        if (!stderr) {
            return CACHE_STOP_SUCCESS;
        }
        throw new Error(`${CACHE_STOP_FAILURE}: \n\n ${stderr}`);
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.isCacheEnabled = async (installDir, network) => {
    try {
        const { components: { cache: { enabled }, }, } = await config_1.getPhaetonConfig(installDir, network);
        return enabled;
    }
    catch (error) {
        throw new Error(error);
    }
};
//# sourceMappingURL=cache.js.map
