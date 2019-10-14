"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const base_1 = tslib_1.__importDefault(require("../../base"));
const pm2_1 = require("../../utils/core/pm2");
class StatusCommand extends base_1.default {
    async run() {
        const { args } = this.parse(StatusCommand);
        const { name } = args;
        if (name) {
            const instance = await pm2_1.describeApplication(name);
            if (!instance) {
                throw new Error(`Phaeton Core instance: ${name} doesn't exists, Please install using phaeton core:install --help`);
            }
            this.print(instance);
        }
        else {
            const instances = await pm2_1.listApplication();
            if (!instances.length) {
                this.print({
                    message: 'Phaeton Core instances not available, Please install using phaeton core:install --help',
                });
            }
            else {
                const toDisplay = [
                    'name',
                    'status',
                    'network',
                    'version',
                    'started_at',
                    'cpu',
                    'memory',
                ];
                const filtered = instances.map(instance => Object.keys(instance).reduce((newObj, key) => toDisplay.includes(key)
                    ? Object.assign({}, newObj, { [key]: instance[key] }) : newObj, {}));
                this.print(filtered);
            }
        }
    }
}
StatusCommand.flags = {
    json: command_1.flags.boolean({
        hidden: true,
    }),
    pretty: command_1.flags.boolean({
        hidden: true,
    }),
};
StatusCommand.args = [
    {
        name: 'name',
        description: 'Phaeton Core installation directory name.',
        required: false,
    },
];
StatusCommand.description = 'Show the status of a Phaeton Core instances.';
StatusCommand.examples = ['core:status', 'core:status mainnet-latest'];
exports.default = StatusCommand;
//# sourceMappingURL=status.js.map
