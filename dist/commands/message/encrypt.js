"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const phaeton_cryptography_1 = require("@phaetonhq/phaeton-cryptography");
const command_1 = require("@oclif/command");
const base_1 = tslib_1.__importDefault(require("../../base"));
const error_1 = require("../../utils/error");
const flags_1 = require("../../utils/flags");
const input_1 = require("../../utils/input");
const processInputs = (recipientPublicKey, message) => ({ passphrase, data, }) => {
    const targetMessage = message || data;
    if (!targetMessage) {
        throw new error_1.ValidationError('No message was provided.');
    }
    if (!passphrase) {
        throw new error_1.ValidationError('No passphrase was provided.');
    }
    return Object.assign({}, phaeton_cryptography_1.encryptMessageWithPassphrase(targetMessage, passphrase, recipientPublicKey), { recipientPublicKey });
};
class EncryptCommand extends base_1.default {
    async run() {
        const { args, flags: { passphrase: passphraseSource, message: messageSource }, } = this.parse(EncryptCommand);
        const { recipientPublicKey, message } = args;
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
        const result = processInputs(recipientPublicKey, message)(inputs);
        this.print(result);
    }
}
EncryptCommand.args = [
    {
        name: 'recipientPublicKey',
        description: 'Public key of the recipient of the message.',
        required: true,
    },
    {
        name: 'message',
        description: 'Message to encrypt.',
    },
];
EncryptCommand.description = `
	Encrypts a message for a given recipient public key using your secret passphrase.
	`;
EncryptCommand.examples = [
    'message:encrypt bba7e2e6a4639c431b68e31115a71ffefcb4e025a4d1656405dfdcd8384719e0 "Hello world"',
];
EncryptCommand.flags = Object.assign({}, base_1.default.flags, { passphrase: command_1.flags.string(flags_1.flags.passphrase), message: command_1.flags.string(flags_1.flags.message) });
exports.default = EncryptCommand;
//# sourceMappingURL=encrypt.js.map
