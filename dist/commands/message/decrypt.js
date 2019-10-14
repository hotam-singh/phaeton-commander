"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const phaeton_cryptography_1 = require("@phaetonhq/phaeton-cryptography");
const command_1 = require("@oclif/command");
const base_1 = tslib_1.__importDefault(require("../../base"));
const error_1 = require("../../utils/error");
const flags_1 = require("../../utils/flags");
const input_1 = require("../../utils/input");
const processInputs = (nonce, senderPublicKey, message) => ({ passphrase, data }) => {
    const targetMessage = message || data;
    if (!targetMessage) {
        throw new error_1.ValidationError('No message was provided.');
    }
    if (!passphrase) {
        throw new error_1.ValidationError('No passphrase was provided.');
    }
    return phaeton_cryptography_1.decryptMessageWithPassphrase(targetMessage, nonce, passphrase, senderPublicKey);
};
class DecryptCommand extends base_1.default {
    async run() {
        const { args, flags: { passphrase: passphraseSource, message: messageSource }, } = this.parse(DecryptCommand);
        const { senderPublicKey, nonce, message } = args;
        if (!message && !messageSource) {
            throw new error_1.ValidationError('No message was provided.');
        }
        const inputs = await input_1.getInputsFromSources({
            passphrase: {
                source: passphraseSource,
            },
            data: message
                ? undefined
                : {
                    source: messageSource,
                },
        });
        const result = processInputs(nonce, senderPublicKey, message)(inputs);
        this.print({ message: result });
    }
}
DecryptCommand.args = [
    {
        name: 'senderPublicKey',
        description: 'Public key of the sender of the message.',
        required: true,
    },
    {
        name: 'nonce',
        description: 'Nonce used during encryption.',
        required: true,
    },
    {
        name: 'message',
        description: 'Encrypted message.',
    },
];
DecryptCommand.description = `
	Decrypts a previously encrypted message from a given sender public key for a known nonce using your secret passphrase.
	`;
DecryptCommand.examples = [
    'message:decrypt bba7e2e6a4639c431b68e31115a71ffefcb4e025a4d1656405dfdcd8384719e0 4b800d90d54eda4d093b5e4e6bf9ed203bc90e1560bd628d dcaa605af45a4107a699755237b4c08e1ef75036743d7e4814dea7',
];
DecryptCommand.flags = Object.assign({}, base_1.default.flags, { passphrase: command_1.flags.string(flags_1.flags.passphrase), message: command_1.flags.string(flags_1.flags.message) });
exports.default = DecryptCommand;
//# sourceMappingURL=decrypt.js.map
