"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const transactions = tslib_1.__importStar(require("@phaetonhq/phaeton-transactions"));
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
class SignCommand extends base_1.default {
    async run() {
        const { args, flags: { passphrase: passphraseSource, 'second-passphrase': secondPassphraseSource, }, } = this.parse(SignCommand);
        const { transaction } = args;
        const transactionInput = transaction || (await getTransactionInput());
        const transactionObject = transactions_1.parseTransactionString(transactionInput);
        const { valid } = transactions.utils.validateTransaction(transactionObject);
        if (!valid) {
            throw new Error('Provided transaction is invalid.');
        }
        const { passphrase, secondPassphrase } = await input_1.getInputsFromSources({
            passphrase: {
                source: passphraseSource,
                repeatPrompt: true,
            },
            secondPassphrase: !secondPassphraseSource
                ? undefined
                : {
                    source: secondPassphraseSource,
                    repeatPrompt: true,
                },
        });
        const result = transactions.utils.prepareTransaction(transactionObject, passphrase, secondPassphrase);
        this.print(result);
    }
}
SignCommand.args = [
    {
        name: 'transaction',
        description: 'Transaction to sign in JSON format.',
    },
];
SignCommand.description = `
	Sign a transaction using your secret passphrase.
	`;
SignCommand.examples = [
    'transaction:sign \'{"amount":"100","recipientId":"13356260975429434553L","senderPublicKey":null,"timestamp":52871598,"type":0,"fee":"10000000","recipientPublicKey":null,"asset":{}}\'',
];
SignCommand.flags = Object.assign({}, base_1.default.flags, { passphrase: command_1.flags.string(flags_1.flags.passphrase), 'second-passphrase': command_1.flags.string(flags_1.flags.secondPassphrase) });
exports.default = SignCommand;
//# sourceMappingURL=sign.js.map
