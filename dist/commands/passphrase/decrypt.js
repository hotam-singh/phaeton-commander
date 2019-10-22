"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const phaeton_cryptography_1 = require("phaeton-cryptography");
const command_1 = require("@oclif/command");
const base_1 = tslib_1.__importDefault(require("../../base"));
const error_1 = require("../../utils/error");
const flags_1 = require("../../utils/flags");
const input_1 = require("../../utils/input");
const passphraseOptionDescription = `Specifies a source for providing an encrypted passphrase to the command. If a string is provided directly as an argument, this option will be ignored. The encrypted passphrase must be provided via an argument or via this option. Sources must be one of \`file\` or \`stdin\`. In the case of \`file\`, a corresponding identifier must also be provided.

	Note: if both an encrypted passphrase and the password are passed via stdin, the password must be the first line.

	Examples:
		- --passphrase file:/path/to/my/encrypted_passphrase.txt (takes the first line only)
		- --passphrase stdin (takes the first line only)
`;
const processInputs = (encryptedPassphrase) => ({ password, data, }) => {
    const encryptedPassphraseTarget = encryptedPassphrase || input_1.getFirstLineFromString(data);
    if (!encryptedPassphraseTarget) {
        throw new error_1.ValidationError('No encrypted passphrase was provided');
    }
    if (!password) {
        throw new error_1.ValidationError('No password was provided');
    }
    const encryptedPassphraseObject = phaeton_cryptography_1.parseEncryptedPassphrase(encryptedPassphraseTarget);
    const passphrase = phaeton_cryptography_1.decryptPassphraseWithPassword(encryptedPassphraseObject, password);
    return { passphrase };
};
class DecryptCommand extends base_1.default {
    async run() {
        const { args, flags: { passphrase: passphraseSource, password: passwordSource }, } = this.parse(DecryptCommand);
        const { encryptedPassphrase } = args;
        if (!encryptedPassphrase && !passphraseSource) {
            throw new error_1.ValidationError('No encrypted passphrase was provided.');
        }
        const inputs = await input_1.getInputsFromSources({
            password: {
                source: passwordSource,
            },
            data: encryptedPassphrase
                ? undefined
                : {
                    source: passphraseSource,
                },
        });
        const result = processInputs(encryptedPassphrase)(inputs);
        this.print(result);
    }
}
DecryptCommand.args = [
    {
        name: 'encryptedPassphrase',
        description: 'Encrypted passphrase to decrypt.',
    },
];
DecryptCommand.description = `
	Decrypts your secret passphrase using the password which was provided at the time of encryption.
	`;
DecryptCommand.examples = [
    'passphrase:decrypt "iterations=1000000&cipherText=9b1c60&iv=5c8843f52ed3c0f2aa0086b0&salt=2240b7f1aa9c899894e528cf5b600e9c&tag=23c01112134317a63bcf3d41ea74e83b&version=1"',
];
DecryptCommand.flags = Object.assign({}, base_1.default.flags, { password: command_1.flags.string(flags_1.flags.password), passphrase: command_1.flags.string({
        description: passphraseOptionDescription,
    }) });
exports.default = DecryptCommand;
//# sourceMappingURL=decrypt.js.map
