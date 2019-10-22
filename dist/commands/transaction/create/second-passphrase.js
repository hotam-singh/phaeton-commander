"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const phaeton_transactions_1 = require("/phaeton-transactions");
const command_1 = require("@oclif/command");
const base_1 = tslib_1.__importDefault(require("../../../base"));
const error_1 = require("../../../utils/error");
const flags_1 = require("../../../utils/flags");
const input_1 = require("../../../utils/input");
exports.processInputs = () => ({ passphrase, secondPassphrase, }) => {
    if (!secondPassphrase) {
        throw new error_1.ValidationError('No second passphrase was provided.');
    }
    return phaeton_transactions_1.registerSecondPassphrase({
        passphrase,
        secondPassphrase,
    });
};
class SecondPassphraseCommand extends base_1.default {
    async run() {
        const { flags: { passphrase: passphraseSource, 'second-passphrase': secondPassphraseSource, 'no-signature': noSignature, }, } = this.parse(SecondPassphraseCommand);
        const processFunction = exports.processInputs();
        const inputs = noSignature
            ? await input_1.getInputsFromSources({
                passphrase: undefined,
                secondPassphrase: {
                    source: secondPassphraseSource,
                    repeatPrompt: true,
                },
            })
            : await input_1.getInputsFromSources({
                passphrase: {
                    source: passphraseSource,
                    repeatPrompt: true,
                },
                secondPassphrase: {
                    source: secondPassphraseSource,
                    repeatPrompt: true,
                },
            });
        const result = processFunction(inputs);
        this.print(result);
    }
}
SecondPassphraseCommand.description = `
	Creates a transaction which will register a second passphrase for the account if broadcast to the network.
	`;
SecondPassphraseCommand.examples = ['transaction:create:second-passphrase'];
SecondPassphraseCommand.flags = Object.assign({}, base_1.default.flags, { passphrase: command_1.flags.string(flags_1.flags.passphrase), 'second-passphrase': command_1.flags.string(flags_1.flags.secondPassphrase), 'no-signature': command_1.flags.boolean(flags_1.flags.noSignature) });
exports.default = SecondPassphraseCommand;
//# sourceMappingURL=second-passphrase.js.map
