"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const phaeton_cryptography_1 = require("@phaetonhq/phaeton-cryptography");
const command_1 = require("@oclif/command");
const base_1 = tslib_1.__importDefault(require("../../base"));
const error_1 = require("../../utils/error");
const flags_1 = require("../../utils/flags");
const input_1 = require("../../utils/input");
const outputPublicKeyOptionDescription = 'Includes the public key in the output. This option is provided for the convenience of node operators.';
const processInputs = (outputPublicKey) => ({ passphrase, password, }) => {
    if (!passphrase) {
        throw new error_1.ValidationError('No passphrase was provided');
    }
    if (!password) {
        throw new error_1.ValidationError('No password was provided');
    }
    const encryptedPassphraseObject = phaeton_cryptography_1.encryptPassphraseWithPassword(passphrase, password);
    const encryptedPassphrase = phaeton_cryptography_1.stringifyEncryptedPassphrase(encryptedPassphraseObject);
    return outputPublicKey
        ? {
            encryptedPassphrase,
            publicKey: phaeton_cryptography_1.getKeys(passphrase).publicKey,
        }
        : { encryptedPassphrase };
};
class EncryptCommand extends base_1.default {
    async run() {
        const { flags: { passphrase: passphraseSource, password: passwordSource, outputPublicKey, }, } = this.parse(EncryptCommand);
        const inputs = await input_1.getInputsFromSources({
            passphrase: {
                source: passphraseSource,
                repeatPrompt: true,
            },
            password: {
                source: passwordSource,
                repeatPrompt: true,
            },
        });
        const result = processInputs(outputPublicKey)(inputs);
        this.print(result);
    }
}
EncryptCommand.description = `
		Encrypts your secret passphrase under a password.
	`;
EncryptCommand.examples = ['passphrase:encrypt'];
EncryptCommand.flags = Object.assign({}, base_1.default.flags, { password: command_1.flags.string(flags_1.flags.password), passphrase: command_1.flags.string(flags_1.flags.passphrase), outputPublicKey: command_1.flags.boolean({
        description: outputPublicKeyOptionDescription,
    }) });
exports.default = EncryptCommand;
//# sourceMappingURL=encrypt.js.map
