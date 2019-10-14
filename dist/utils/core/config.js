"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const os = tslib_1.__importStar(require("os"));
const path = tslib_1.__importStar(require("path"));
const worker_process_1 = require("../worker-process");
exports.defaultPhaetonPath = path.join(os.homedir(), '.phaeton');
exports.defaultPhaetonPm2Path = `${exports.defaultPhaetonPath}/pm2`;
exports.defaultPhaetonInstancePath = `${exports.defaultPhaetonPath}/instances`;
exports.defaultBackupPath = `${exports.defaultPhaetonPath}/backups`;
const NODE_BIN = './bin/node';
exports.getPhaetonConfig = async (installDir, network) => {
    const cmd = `${NODE_BIN} scripts/generate_config.js -n ${network} | head -n 10000`;
    const kb = 1024;
    const size = 400;
    const maxBuffer = kb * size;
    const { stdout, stderr } = await worker_process_1.exec(cmd, { cwd: installDir, maxBuffer });
    if (stderr) {
        throw new Error(stderr);
    }
    return JSON.parse(stdout);
};
//# sourceMappingURL=config.js.map
