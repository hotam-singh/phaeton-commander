"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const fsExtra = tslib_1.__importStar(require("fs-extra"));
const listr_1 = tslib_1.__importDefault(require("listr"));
const base_1 = tslib_1.__importDefault(require("../../base"));
const config_1 = require("../../utils/core/config");
const pm2_1 = require("../../utils/core/pm2");
const stop_1 = tslib_1.__importDefault(require("./stop"));
class UnInstallCommand extends base_1.default {
    async run() {
        const { args } = this.parse(UnInstallCommand);
        const { name } = args;
        try {
            const instance = await pm2_1.describeApplication(name);
            if (!instance) {
                this.log(`Phaeton Core instance: ${name} doesn't exists, Please install using phaeton core:install`);
                return;
            }
            await stop_1.default.run([name]);
            const { installationPath, network } = instance;
            const tasks = new listr_1.default([
                {
                    title: `Uninstall Phaeton Core ${network} instance Installed as ${name}`,
                    task: async () => {
                        await pm2_1.unRegisterApplication(name);
                        fsExtra.removeSync(installationPath);
                    },
                },
                {
                    title: `Remove ${name} backup`,
                    task: () => {
                        fsExtra.removeSync(`${config_1.defaultBackupPath}/${name}`);
                    },
                },
            ]);
            await tasks.run();
        }
        catch (error) {
            this.error(error);
        }
    }
}
UnInstallCommand.args = [
    {
        name: 'name',
        description: 'Phaeton Core installation directory name.',
        required: true,
    },
];
UnInstallCommand.flags = {
    json: command_1.flags.boolean(Object.assign({}, base_1.default.flags.json, { hidden: true })),
    pretty: command_1.flags.boolean(Object.assign({}, base_1.default.flags.pretty, { hidden: true })),
};
UnInstallCommand.description = 'Uninstall an instance of Phaeton Core.';
UnInstallCommand.examples = ['core:uninstall mainnet-latest'];
exports.default = UnInstallCommand;
//# sourceMappingURL=uninstall.js.map
