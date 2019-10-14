"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const listr_1 = tslib_1.__importDefault(require("listr"));
const base_1 = tslib_1.__importDefault(require("../../../base"));
const database_1 = require("../../../utils/core/database");
const pm2_1 = require("../../../utils/core/pm2");
class DatabaseCommand extends base_1.default {
    async run() {
        const { args } = this.parse(DatabaseCommand);
        const { name } = args;
        const instance = await pm2_1.describeApplication(name);
        if (!instance) {
            this.log(`Phaeton Core instance: ${name} doesn't exists, Please install using phaeton core:install`);
            return;
        }
        const { installationPath } = instance;
        const tasks = new listr_1.default([
            {
                title: 'Start the database server',
                task: async () => database_1.startDatabase(installationPath, name),
            },
        ]);
        await tasks.run();
    }
}
DatabaseCommand.args = [
    {
        name: 'name',
        description: 'Phaeton Core installation directory name.',
        required: true,
    },
];
DatabaseCommand.flags = {
    json: command_1.flags.boolean(Object.assign({}, base_1.default.flags.json, { hidden: true })),
    pretty: command_1.flags.boolean(Object.assign({}, base_1.default.flags.pretty, { hidden: true })),
};
DatabaseCommand.description = 'Start the database server.';
DatabaseCommand.examples = ['core:start:database mainnet-latest'];
exports.default = DatabaseCommand;
//# sourceMappingURL=database.js.map
