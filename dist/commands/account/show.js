"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const phaeton_cryptography_1 = require("phaeton-cryptography");
const command_1 = require("@oclif/command");
const base_1 = tslib_1.__importDefault(require("../../base"));
const error_1 = require("../../utils/error");
const flags_1 = require("../../utils/flags");
const input_1 = require("../../utils/input");
const processInput = ({ passphrase }) => {
    if (!passphrase) {
        throw new error_1.ValidationError('Passphrase cannot be empty');
    }
    const { privateKey, publicKey } = phaeton_cryptography_1.getKeys(passphrase);
    const address = phaeton_cryptography_1.getAddressFromPublicKey(publicKey);
    return {
        privateKey,
        publicKey,
        address,
    };
};
class ShowCommand extends base_1.default {
    async run() {
        const { flags: { passphrase: passphraseSource }, } = this.parse(ShowCommand);
        const input = await input_1.getInputsFromSources({
            passphrase: {
                source: passphraseSource,
                repeatPrompt: true,
            },
        });
        this.print(processInput(input));
    }
}
ShowCommand.description = `
		Shows account information for a given passphrase.
	`;
ShowCommand.examples = ['account:show'];
ShowCommand.flags = Object.assign({}, base_1.default.flags, { passphrase: command_1.flags.string(flags_1.flags.passphrase) });
exports.default = ShowCommand;
//# sourceMappingURL=show.js.map
