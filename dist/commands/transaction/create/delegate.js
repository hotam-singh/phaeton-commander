"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const phaeton_transactions_1 = require("@phaetonhq/phaeton-transactions");
const command_1 = require("@oclif/command");
const base_1 = tslib_1.__importDefault(require("../../../base"));
const flags_1 = require("../../../utils/flags");
const input_1 = require("../../../utils/input");
const processInputs = (username) => ({ passphrase, secondPassphrase, }) => phaeton_transactions_1.registerDelegate({
    passphrase,
    secondPassphrase,
    username,
});
class DelegateCommand extends base_1.default {
    async run() {
        const { args, flags: { passphrase: passphraseSource, 'second-passphrase': secondPassphraseSource, 'no-signature': noSignature, }, } = this.parse(DelegateCommand);
        const { username } = args;
        const processFunction = processInputs(username);
        if (noSignature) {
            const noSignatureResult = processFunction({
                passphrase: undefined,
                secondPassphrase: undefined,
            });
            this.print(noSignatureResult);
            return;
        }
        const inputs = await input_1.getInputsFromSources({
            passphrase: {
                source: passphraseSource,
                repeatPrompt: true,
            },
            secondPassphrase: !secondPassphraseSource
                ? undefined
                : {
                    source: secondPassphraseSource,
                    repeatPrompt: true,
                },
        });
        const result = processFunction(inputs);
        this.print(result);
    }
}
DelegateCommand.args = [
    {
        name: 'username',
        required: true,
        description: 'Username to register as a delegate.',
    },
];
DelegateCommand.description = `
	Creates a transaction which will register the account as a delegate candidate if broadcast to the network.
	`;
DelegateCommand.examples = ['transaction:create:delegate lightcurve'];
DelegateCommand.flags = Object.assign({}, base_1.default.flags, { passphrase: command_1.flags.string(flags_1.flags.passphrase), 'second-passphrase': command_1.flags.string(flags_1.flags.secondPassphrase), 'no-signature': command_1.flags.boolean(flags_1.flags.noSignature) });
exports.default = DelegateCommand;
//# sourceMappingURL=delegate.js.map
