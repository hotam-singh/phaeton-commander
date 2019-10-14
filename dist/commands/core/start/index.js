"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const listr_1 = tslib_1.__importDefault(require("listr"));
const base_1 = tslib_1.__importDefault(require("../../../base"));
const pm2_1 = require("../../../utils/core/pm2");
const cache_1 = tslib_1.__importDefault(require("./cache"));
const database_1 = tslib_1.__importDefault(require("./database"));
class StartCommand extends base_1.default {
    async run() {
        const { args } = this.parse(StartCommand);
        const { name } = args;
        const instance = await pm2_1.describeApplication(name);
        if (!instance) {
            this.log(`Phaeton Core instance: ${name} doesn't exists, Please install using phaeton core:install`);
            return;
        }
        await cache_1.default.run([name]);
        await database_1.default.run([name]);
        const tasks = new listr_1.default([
            {
                title: 'Start Phaeton Core instance',
                task: async () => {
                    await pm2_1.restartApplication(name);
                },
            },
        ]);
        await tasks.run();
    }
}
StartCommand.args = [
    {
        name: 'name',
        description: 'Phaeton Core installation directory name.',
        required: true,
    },
];
StartCommand.flags = {
    json: command_1.flags.boolean(Object.assign({}, base_1.default.flags.json, { hidden: true })),
    pretty: command_1.flags.boolean(Object.assign({}, base_1.default.flags.pretty, { hidden: true })),
};
StartCommand.description = 'Start Phaeton Core instance.';
StartCommand.examples = ['core:start mainnet-latest'];
exports.default = StartCommand;
//# sourceMappingURL=index.js.map
