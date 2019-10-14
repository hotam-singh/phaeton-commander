"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const listr_1 = tslib_1.__importDefault(require("listr"));
const base_1 = tslib_1.__importDefault(require("../../../base"));
const cache_1 = require("../../../utils/core/cache");
const pm2_1 = require("../../../utils/core/pm2");
class CacheCommand extends base_1.default {
    async run() {
        const { args } = this.parse(CacheCommand);
        const { name } = args;
        const instance = await pm2_1.describeApplication(name);
        if (!instance) {
            this.log(`Phaeton Core instance: ${name} doesn't exists, Please install using phaeton core:install`);
            return;
        }
        const { installationPath, network } = instance;
        const tasks = new listr_1.default([
            {
                title: 'Start the cache server',
                skip: async () => !(await cache_1.isCacheEnabled(installationPath, network)),
                task: async () => {
                    const isRunning = await cache_1.isCacheRunning(installationPath, name);
                    if (!isRunning) {
                        await cache_1.startCache(installationPath, name);
                    }
                },
            },
        ]);
        await tasks.run();
    }
}
CacheCommand.args = [
    {
        name: 'name',
        description: 'Phaeton Core installation directory name.',
        required: true,
    },
];
CacheCommand.flags = {
    json: command_1.flags.boolean(Object.assign({}, base_1.default.flags.json, { hidden: true })),
    pretty: command_1.flags.boolean(Object.assign({}, base_1.default.flags.pretty, { hidden: true })),
};
CacheCommand.description = 'Start the cache server.';
CacheCommand.examples = ['core:start:cache mainnet-latest'];
exports.default = CacheCommand;
//# sourceMappingURL=cache.js.map
