"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const phaeton_cryptography_1 = require("@phaetonhq/phaeton-cryptography");
const command_1 = require("@oclif/command");
const base_1 = tslib_1.__importDefault(require("../../base"));
const error_1 = require("../../utils/error");
const flags_1 = require("../../utils/flags");
const input_1 = require("../../utils/input");
const processInputs = (publicKey, signature, message) => ({ data }) => {
    const targetMessage = message || data;
    if (!targetMessage) {
        throw new error_1.ValidationError('No message was provided.');
    }
    return {
        verified: phaeton_cryptography_1.verifyMessageWithPublicKey({
            publicKey,
            signature,
            message: targetMessage,
        }),
    };
};
class VerifyCommand extends base_1.default {
    async run() {
        const { args, flags: { message: messageSource }, } = this.parse(VerifyCommand);
        const { publicKey, signature, message } = args;
        if (!message && !messageSource) {
            throw new error_1.ValidationError('No message was provided.');
        }
        const inputs = await input_1.getInputsFromSources({
            data: message ? undefined : { source: messageSource },
        });
        const result = processInputs(publicKey, signature, message)(inputs);
        this.print(result);
    }
}
VerifyCommand.args = [
    {
        name: 'publicKey',
        description: 'Public key of the signer of the message.',
        required: true,
    },
    {
        name: 'signature',
        description: 'Signature to verify.',
        required: true,
    },
    {
        name: 'message',
        description: 'Message to verify.',
    },
];
VerifyCommand.description = `
	Verifies a signature for a message using the signer’s public key.
	`;
VerifyCommand.examples = [
    'message:verify 647aac1e2df8a5c870499d7ddc82236b1e10936977537a3844a6b05ea33f9ef6 2a3ca127efcf7b2bf62ac8c3b1f5acf6997cab62ba9fde3567d188edcbacbc5dc8177fb88d03a8691ce03348f569b121bca9e7a3c43bf5c056382f35ff843c09 "Hello world"',
];
VerifyCommand.flags = Object.assign({}, base_1.default.flags, { message: command_1.flags.string(flags_1.flags.message) });
exports.default = VerifyCommand;
//# sourceMappingURL=verify.js.map
