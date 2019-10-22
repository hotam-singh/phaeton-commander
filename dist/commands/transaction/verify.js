"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const transactions = tslib_1.__importStar(require("phaeton-passphrase"));
const command_1 = require("@oclif/command");
const base_1 = tslib_1.__importDefault(require("../../base"));
const error_1 = require("../../utils/error");
const utils_1 = require("../../utils/input/utils");
const transactions_1 = require("../../utils/transactions");
const secondPublicKeyDescription = `Specifies a source for providing a second public key to the command. The second public key must be provided via this option. Sources must be one of \`file\` or \`stdin\`. In the case of \`file\`, a corresponding identifier must also be provided.

	Note: if both transaction and second public key are passed via stdin, the transaction must be the first line.

	Examples:
	- --second-public-key file:/path/to/my/message.txt
	- --second-public-key 790049f919979d5ea42cca7b7aa0812cbae8f0db3ee39c1fe3cef18e25b67951
`;
const getTransactionInput = async () => {
    try {
        const { data } = await utils_1.getStdIn({ dataIsRequired: true });
        if (!data) {
            throw new error_1.ValidationError('No transaction was provided.');
        }
        return data;
    }
    catch (e) {
        throw new error_1.ValidationError('No transaction was provided.');
    }
};
const processSecondPublicKey = async (secondPublicKey) => secondPublicKey.includes(':') ? utils_1.getData(secondPublicKey) : secondPublicKey;
class VerifyCommand extends base_1.default {
    async run() {
        const { args, flags: { 'second-public-key': secondPublicKeySource }, } = this.parse(VerifyCommand);
        const { transaction } = args;
        const transactionInput = transaction || (await getTransactionInput());
        const transactionObject = transactions_1.parseTransactionString(transactionInput);
        const secondPublicKey = secondPublicKeySource
            ? await processSecondPublicKey(secondPublicKeySource)
            : undefined;
        const verified = transactions.utils.verifyTransaction(transactionObject, secondPublicKey);
        this.print({ verified });
    }
}
VerifyCommand.args = [
    {
        name: 'transaction',
        description: 'Transaction to verify in JSON format.',
    },
];
VerifyCommand.description = `
	Verifies a transaction has a valid signature.
	`;
VerifyCommand.examples = [
    'transaction:verify \'{"type":0,"amount":"100",...}\'',
    'transaction:verify \'{"type":0,"amount":"100",...}\' --second-public-key=647aac1e2df8a5c870499d7ddc82236b1e10936977537a3844a6b05ea33f9ef6',
];
VerifyCommand.flags = Object.assign({}, base_1.default.flags, { 'second-public-key': command_1.flags.string({
        name: 'Second public key',
        description: secondPublicKeyDescription,
    }) });
exports.default = VerifyCommand;
//# sourceMappingURL=verify.js.map
