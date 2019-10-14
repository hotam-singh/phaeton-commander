"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const path = tslib_1.__importStar(require("path"));
const pm2_1 = require("pm2");
const connectPM2 = async () => new Promise((resolve, reject) => {
    pm2_1.connect(err => {
        if (err) {
            reject(err);
            return;
        }
        resolve();
    });
});
const startPM2 = async (installPath, network, name, envConfig) => {
    const { apps } = await fs_extra_1.default.readJson(`${installPath}/etc/pm2-phaeton.json`);
    return new Promise((resolve, reject) => {
        pm2_1.start({
            name,
            script: apps[0].script,
            args: apps[0].args,
            interpreter: `${installPath}/bin/node`,
            cwd: installPath,
            env: Object.assign({ PHAETON_NETWORK: network }, envConfig),
            pid: path.join(installPath, '/pids/phaeton.app.pid'),
            output: path.join(installPath, '/logs/phaeton.app.log'),
            error: path.join(installPath, '/logs/phaeton.app.err'),
            log_date_format: 'YYYY-MM-DD HH:mm:ss SSS',
            watch: false,
            kill_timeout: 10000,
            max_memory_restart: '1024M',
            min_uptime: 20000,
            max_restarts: 10,
        }, err => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
            return;
        });
    });
};
const restartPM2 = async (process) => new Promise((resolve, reject) => {
    pm2_1.restart(process, err => {
        if (err && err.message !== 'process name not found') {
            reject(err.message);
            return;
        }
        resolve();
    });
});
const stopPM2 = async (process) => new Promise((resolve, reject) => {
    pm2_1.stop(process, err => {
        if (err && err.message !== 'process name not found') {
            reject();
            return;
        }
        resolve();
    });
});
const describePM2 = async (process) => new Promise((resolve, reject) => {
    pm2_1.describe(process, (err, descs) => {
        if (err && err.message !== 'process name not found') {
            reject(err);
            return;
        }
        const pDesc = descs.find(desc => desc.pid === process || desc.name === process);
        if (!pDesc) {
            reject(new Error(`Process ${process} not found`));
        }
        resolve(pDesc);
    });
});
const listPM2 = async () => new Promise((resolve, reject) => {
    pm2_1.list((err, res) => {
        if (err) {
            reject(err);
            return;
        }
        resolve(res);
    });
});
const deleteProcess = async (process) => new Promise((resolve, reject) => {
    pm2_1.delete(process, err => {
        if (err) {
            reject(err);
            return;
        }
        resolve();
        return;
    });
});
exports.registerApplication = async (installPath, network, name, envConfig) => {
    await connectPM2();
    await startPM2(installPath, network, name, envConfig);
    await stopPM2(name);
    pm2_1.disconnect();
};
exports.unRegisterApplication = async (name) => {
    await connectPM2();
    await deleteProcess(name);
    pm2_1.disconnect();
};
exports.restartApplication = async (name) => {
    await connectPM2();
    await restartPM2(name);
    pm2_1.disconnect();
};
exports.stopApplication = async (name) => {
    await connectPM2();
    await stopPM2(name);
    pm2_1.disconnect();
};
const extractProcessDetails = (appDesc) => {
    const { pm2_env, monit, name, pid } = appDesc;
    const { status, pm_uptime, pm_cwd: installationPath, version, PHAETON_NETWORK: network, PHAETON_DB_PORT: dbPort, PHAETON_REDIS_PORT: redisPort, PHAETON_HTTP_PORT: httpPort, PHAETON_WS_PORT: wsPort, } = pm2_env;
    return Object.assign({ name,
        pid,
        status,
        version,
        network,
        dbPort,
        redisPort,
        httpPort,
        wsPort,
        installationPath, started_at: new Date(pm_uptime).toLocaleString() }, monit);
};
exports.listApplication = async () => {
    await connectPM2();
    const applications = (await listPM2());
    pm2_1.disconnect();
    return applications.map(extractProcessDetails);
};
exports.describeApplication = async (name) => {
    try {
        await connectPM2();
        const application = await describePM2(name);
        pm2_1.disconnect();
        return extractProcessDetails(application);
    }
    catch (error) {
        pm2_1.disconnect();
        return undefined;
    }
};
//# sourceMappingURL=pm2.js.map
