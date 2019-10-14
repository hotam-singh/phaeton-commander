"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const phaeton_cryptography_1 = require("@phaetonhq/phaeton-cryptography");
const command_1 = require("@oclif/command");
const base_1 = tslib_1.__importDefault(require("../../base"));
const error_1 = require("../../utils/error");
const flags_1 = require("../../utils/flags");
const input_1 = require("../../utils/input");
const processInputs = (message) => ({ passphrase, data, }) => {
    const targetMessage = message || data;
    if (!targetMessage) {
        throw new error_1.ValidationError('No message was provided.');
    }
    if (!passphrase) {
        throw new error_1.ValidationError('No passphrase was provided.');
    }
    return phaeton_cryptography_1.signMessageWithPassphrase(targetMessage, passphrase);
};
class SignCommand extends base_1.default {
    async run() {
        const { args, flags: { passphrase: passphraseSource, message: messageSource }, } = this.parse(SignCommand);
        const { message } = args;
        if (!message && !messageSource) {
            throw new error_1.ValidationError('No message was provided.');
        }
        const inputs = await input_1.getInputsFromSources({
            passphrase: {
                source: passphraseSource,
                repeatPrompt: true,
            },
            data: message
                ? undefined
                : {
                    source: messageSource,
                },
        });
        const result = processInputs(message)(inputs);
        this.print(result);
    }
}
SignCommand.args = [
    {
        name: 'message',
        description: 'Message to sign.',
    },
];
SignCommand.description = `
	Signs a message using your secret passphrase.
	`;
SignCommand.examples = ['message:sign "Hello world"'];
SignCommand.flags = Object.assign({}, base_1.default.flags, { passphrase: command_1.flags.string(flags_1.flags.passphrase), message: command_1.flags.string(flags_1.flags.message) });
exports.default = SignCommand;
//# sourceMappingURL=sign.js.map
