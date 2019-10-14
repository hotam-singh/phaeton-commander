"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const childProcess = tslib_1.__importStar(require("child_process"));
const base_1 = tslib_1.__importDefault(require("../../base"));
const pm2_1 = require("../../utils/core/pm2");
class LogsCommand extends base_1.default {
    async run() {
        const { args } = this.parse(LogsCommand);
        const { name } = args;
        const instance = await pm2_1.describeApplication(name);
        if (!instance) {
            this.log(`Phaeton Core instance: ${name} doesn't exists, Please install using phaeton core:install`);
            return;
        }
        const { installationPath, network } = instance;
        const fileName = `${installationPath}/logs/${network}/phaeton.log`;
        const tail = childProcess.spawn('tail', ['-f', fileName]);
        const { stderr, stdout } = tail;
        stdout.on('data', data => {
            this.log(data.toString('utf-8').replace(/\n/, ''));
        });
        stderr.on('data', data => {
            this.log(data.message);
        });
        tail.on('close', () => {
            tail.removeAllListeners();
        });
        tail.on('error', err => {
            this.log(`Failed to process logs for ${name} with error: ${err.message}`);
            tail.removeAllListeners();
        });
    }
}
LogsCommand.args = [
    {
        name: 'name',
        description: 'Phaeton Core installation directory name.',
        required: true,
    },
];
LogsCommand.flags = {
    json: command_1.flags.boolean(Object.assign({}, base_1.default.flags.json, { hidden: true })),
    pretty: command_1.flags.boolean(Object.assign({}, base_1.default.flags.pretty, { hidden: true })),
};
LogsCommand.description = 'Stream logs of a Phaeton Core instance.';
LogsCommand.examples = ['core:logs mainnet-latest'];
exports.default = LogsCommand;
//# sourceMappingURL=logs.js.map
