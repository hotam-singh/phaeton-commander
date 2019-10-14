"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const child_process_1 = tslib_1.__importDefault(require("child_process"));
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const config_1 = require("./core/config");
exports.exec = async (command, options = {}) => new Promise(resolve => {
    child_process_1.default.exec(command, options, (error, stdout, stderr) => {
        if (error || stderr) {
            fs_extra_1.default.writeJSONSync(`${config_1.defaultPhaetonInstancePath}/error.log`, {
                error,
                stderr,
            });
        }
        resolve({ stdout, stderr: error });
    });
});
//# sourceMappingURL=worker-process.js.map
