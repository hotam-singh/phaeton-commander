"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const base_1 = tslib_1.__importDefault(require("../../base"));
const api_1 = require("../../utils/api");
const error_1 = require("../../utils/error");
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
class BroadcastCommand extends base_1.default {
    async run() {
        const { args: { transaction }, } = this.parse(BroadcastCommand);
        const transactionInput = transaction || (await getTransactionInput());
        const transactionObject = transactions_1.parseTransactionString(transactionInput);
        const client = api_1.getAPIClient(this.userConfig.api);
        const response = await client.transactions.broadcast(transactionObject);
        this.print(response.data);
    }
}
BroadcastCommand.args = [
    {
        name: 'transaction',
        description: 'Transaction to broadcast in JSON format.',
    },
];
BroadcastCommand.description = `
	Broadcasts a transaction to the network via the node specified in the current config.
	Accepts a stringified JSON transaction as an argument, or a transaction can be piped from a previous command.
	If piping make sure to quote out the entire command chain to avoid piping-related conflicts in your shell.
	`;
BroadcastCommand.examples = [
    'broadcast transaction \'{"type":0,"amount":"100",...}\'',
    'echo \'{"type":0,"amount":"100",...}\' | phaeton transaction:broadcast',
];
BroadcastCommand.flags = Object.assign({}, base_1.default.flags);
exports.default = BroadcastCommand;
//# sourceMappingURL=broadcast.js.map
