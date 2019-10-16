"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const phaeton_cryptography_1 = require("phaeton-cryptography");
const command_1 = require("@oclif/command");
const base_1 = tslib_1.__importDefault(require("../../base"));
const mnemonic_1 = require("../../utils/mnemonic");
const createAccount = () => {
    const passphrase = mnemonic_1.createMnemonicPassphrase();
    const { privateKey, publicKey } = phaeton_cryptography_1.getKeys(passphrase);
    const address = phaeton_cryptography_1.getAddressFromPublicKey(publicKey);
    return {
        passphrase,
        privateKey,
        publicKey,
        address,
    };
};
class CreateCommand extends base_1.default {
    async run() {
        const { flags: { number: numberStr }, } = this.parse(CreateCommand);
        const numberOfAccounts = parseInt(numberStr, 10);
        if (numberStr !== numberOfAccounts.toString() ||
            !Number.isInteger(numberOfAccounts) ||
            numberOfAccounts <= 0) {
            throw new Error('Number flag must be an integer and greater than 0');
        }
        const accounts = new Array(numberOfAccounts).fill(0).map(createAccount);
        this.print(accounts);
    }
}
CreateCommand.description = `
		Returns a randomly-generated mnemonic passphrase with its corresponding public/private key pair and Phaeton address.
	`;
CreateCommand.examples = ['account:create', 'account:create --number=3'];
CreateCommand.flags = Object.assign({}, base_1.default.flags, { number: command_1.flags.string({
        char: 'n',
        description: 'Number of accounts to create.',
        default: '1',
    }) });
exports.default = CreateCommand;
//# sourceMappingURL=create.js.map
