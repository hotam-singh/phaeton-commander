"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const transactions = tslib_1.__importStar(require("@phaetonhq/phaeton-transactions"));
const command_1 = require("@oclif/command");
const base_1 = tslib_1.__importDefault(require("../../base"));
const api_1 = require("../../utils/api");
const error_1 = require("../../utils/error");
const flags_1 = require("../../utils/flags");
const input_1 = require("../../utils/input");
const STATUS_ENABLE = 'enable';
const STATUS_DISABLE = 'disable';
const processInput = async (client, status, publicKey, password) => {
    if (!password) {
        throw new error_1.ValidationError('No password was provided.');
    }
    return client.node
        .updateForgingStatus({
        password,
        publicKey,
        forging: status === STATUS_ENABLE,
    })
        .then(response => response.data);
};
class ForgingCommand extends base_1.default {
    async run() {
        const { args, flags: { password: passwordSource }, } = this.parse(ForgingCommand);
        const { status, publicKey } = args;
        transactions.utils.validatePublicKey(publicKey);
        const client = api_1.getAPIClient(this.userConfig.api);
        const { password } = await input_1.getInputsFromSources({
            password: {
                source: passwordSource,
            },
        });
        const result = await processInput(client, status, publicKey, password);
        this.print(result);
    }
}
ForgingCommand.args = [
    {
        name: 'status',
        options: [STATUS_ENABLE, STATUS_DISABLE],
        description: 'Desired forging status.',
        required: true,
    },
    {
        name: 'publicKey',
        description: 'Public key of the delegate whose status should be updated.',
        required: true,
    },
];
ForgingCommand.description = `Update the forging status of a Phaeton Core instance.`;
ForgingCommand.examples = [
    'node:forging enable 647aac1e2df8a5c870499d7ddc82236b1e10936977537a3844a6b05ea33f9ef6',
    'node:forging disable 647aac1e2df8a5c870499d7ddc82236b1e10936977537a3844a6b05ea33f9ef6',
];
ForgingCommand.flags = Object.assign({}, base_1.default.flags, { password: command_1.flags.string(flags_1.flags.password) });
exports.default = ForgingCommand;
//# sourceMappingURL=forging.js.map
