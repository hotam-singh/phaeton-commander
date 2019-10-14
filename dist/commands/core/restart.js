"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const base_1 = tslib_1.__importDefault(require("../../base"));
const pm2_1 = require("../../utils/core/pm2");
const start_1 = tslib_1.__importDefault(require("./start"));
const stop_1 = tslib_1.__importDefault(require("./stop"));
class RestartCommand extends base_1.default {
    async run() {
        const { args } = this.parse(RestartCommand);
        const { name } = args;
        const instance = await pm2_1.describeApplication(name);
        if (!instance) {
            this.log(`Phaeton Core instance: ${name} doesn't exists, Please install using phaeton core:install`);
            return;
        }
        await stop_1.default.run([name]);
        await start_1.default.run([name]);
    }
}
RestartCommand.args = [
    {
        name: 'name',
        description: 'Phaeton Core installation directory name.',
        required: true,
    },
];
RestartCommand.flags = {
    json: command_1.flags.boolean(Object.assign({}, base_1.default.flags.json, { hidden: true })),
    pretty: command_1.flags.boolean(Object.assign({}, base_1.default.flags.pretty, { hidden: true })),
};
RestartCommand.description = 'Restart Phaeton Core instance.';
RestartCommand.examples = ['core:restart mainnet-latest'];
exports.default = RestartCommand;
//# sourceMappingURL=restart.js.map
