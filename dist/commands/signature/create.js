"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const transactions = tslib_1.__importStar(require("/phaeton-transactions"));
const command_1 = require("@oclif/command");
const base_1 = tslib_1.__importDefault(require("../../base"));
const error_1 = require("../../utils/error");
const flags_1 = require("../../utils/flags");
const input_1 = require("../../utils/input");
const utils_1 = require("../../utils/input/utils");
const transactions_1 = require("../../utils/transactions");
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
class CreateCommand extends base_1.default {
    async run() {
        const { args, flags: { passphrase: passphraseSource }, } = this.parse(CreateCommand);
        const { transaction } = args;
        const transactionInput = transaction || (await getTransactionInput());
        const transactionObject = transactions_1.parseTransactionString(transactionInput);
        const { valid } = transactions.utils.validateTransaction(transactionObject);
        if (!valid) {
            throw new Error('Provided transaction is invalid.');
        }
        const { passphrase } = await input_1.getInputsFromSources({
            passphrase: {
                source: passphraseSource,
                repeatPrompt: true,
            },
        });
        if (!passphrase) {
            throw new error_1.ValidationError('No passphrase was provided.');
        }
        const result = transactions.createSignatureObject(transactionObject, passphrase);
        this.print(result);
    }
}
CreateCommand.args = [
    {
        name: 'transaction',
        description: 'Transaction in JSON format.',
    },
];
CreateCommand.description = `
	Create a signature object for a transaction from a multisignature account.
	Accepts a stringified JSON transaction as an argument.
	`;
CreateCommand.examples = [
    'signature:create \'{"amount":"10","recipientId":"8050281191221330746L","senderPublicKey":"3358a1562f9babd523a768e700bb12ad58f230f84031055802dc0ea58cef1e1b","timestamp":59353522,"type":0,"asset":{},"signature":"b84b95087c381ad25b5701096e2d9366ffd04037dcc941cd0747bfb0cf93111834a6c662f149018be4587e6fc4c9f5ba47aa5bbbd3dd836988f153aa8258e604"}\'',
];
CreateCommand.flags = Object.assign({}, base_1.default.flags, { passphrase: command_1.flags.string(flags_1.flags.passphrase) });
exports.default = CreateCommand;
//# sourceMappingURL=create.js.map
