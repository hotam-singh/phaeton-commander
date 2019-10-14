"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const base_1 = tslib_1.__importDefault(require("../../base"));
const api_1 = require("../../utils/api");
const query_1 = require("../../utils/query");
const TRANSACTION_STATES = ['unsigned', 'unprocessed'];
const SORT_OPTIONS = [
    'amount:asc',
    'amount:desc',
    'fee:asc',
    'fee:desc',
    'type:asc',
    'type:desc',
    'timestamp:asc',
    'timestamp:desc',
];
const senderIdFlag = {
    description: `Get transactions based by sender-id which is sender's phaeton address'.
	Examples:
	- --sender-id=12668885769632475474L
`,
};
const stateFlag = {
    char: 's',
    options: TRANSACTION_STATES,
    description: `Get transactions based on a given state. Possible values for the state are 'unsigned' and 'unprocessed'.
	Examples:
	- --state=unsigned
	- --state=unprocessed
`,
};
class GetCommand extends base_1.default {
    async run() {
        const { args, flags: { limit, offset, sort, 'sender-id': senderAddress, state: txnState, }, } = this.parse(GetCommand);
        const { ids: idsStr } = args;
        const ids = idsStr ? idsStr.split(',').filter(Boolean) : undefined;
        const client = api_1.getAPIClient(this.userConfig.api);
        if (txnState && senderAddress && ids) {
            const reqTxnSenderId = ids.map(id => ({
                query: {
                    limit: 1,
                    id,
                    senderId: senderAddress,
                },
                placeholder: {
                    id,
                    senderId: senderAddress,
                    message: 'Transaction not found.',
                },
            }));
            const stateSenderIdsResult = await query_1.queryNodeTransaction(client.node, txnState, reqTxnSenderId);
            this.print(stateSenderIdsResult);
            return;
        }
        if (txnState && ids) {
            const reqTransactionIds = ids.map(id => ({
                query: {
                    limit: 1,
                    id,
                },
                placeholder: {
                    id,
                    message: 'Transaction not found.',
                },
            }));
            const txnStateIdsResult = await query_1.queryNodeTransaction(client.node, txnState, reqTransactionIds);
            this.print(txnStateIdsResult);
            return;
        }
        if (txnState && senderAddress) {
            const reqWithSenderId = [
                {
                    query: {
                        limit,
                        offset,
                        sort,
                        senderId: senderAddress,
                    },
                    placeholder: {
                        senderId: senderAddress,
                        message: 'Transaction not found.',
                    },
                },
            ];
            const txnStateSenderResult = await query_1.queryNodeTransaction(client.node, txnState, reqWithSenderId);
            this.print(txnStateSenderResult);
            return;
        }
        if (txnState) {
            const reqByLimitOffset = [
                {
                    query: {
                        limit,
                        offset,
                        sort,
                    },
                    placeholder: {
                        message: 'No transactions found.',
                    },
                },
            ];
            const txnStateResult = await query_1.queryNodeTransaction(client.node, txnState, reqByLimitOffset);
            this.print(txnStateResult);
            return;
        }
        if (ids) {
            const reqTransactionIDs = ids.map(id => ({
                query: {
                    limit: 1,
                    id,
                },
                placeholder: {
                    id,
                    message: 'Transaction not found.',
                },
            }));
            const idsResult = await query_1.query(client, 'transactions', reqTransactionIDs);
            this.print(idsResult);
            return;
        }
        if (senderAddress) {
            const reqSenderId = {
                query: {
                    limit,
                    offset,
                    sort,
                    senderId: senderAddress,
                },
                placeholder: {
                    message: 'No transactions found.',
                },
            };
            const senderAddressResult = await query_1.query(client, 'transactions', reqSenderId);
            this.print(senderAddressResult);
            return;
        }
        const req = {
            query: {
                limit,
                offset,
                sort,
            },
            placeholder: {
                message: 'No transactions found.',
            },
        };
        const defaultResults = await query_1.query(client, 'transactions', req);
        this.print(defaultResults);
    }
}
GetCommand.args = [
    {
        name: 'ids',
        required: false,
        description: 'Comma-separated transaction ID(s) to get information about.',
    },
];
GetCommand.description = `
	Gets transaction information from the blockchain.
	`;
GetCommand.examples = [
    'transaction:get 10041151099734832021',
    'transaction:get 10041151099734832021,1260076503909567890',
    'transaction:get 10041151099734832021,1260076503909567890 --state=unprocessed',
    'transaction:get --state=unsigned --sender-id=1813095620424213569L',
    'transaction:get 10041151099734832021 --state=unsigned --sender-id=1813095620424213569L',
    'transaction:get --sender-id=1813095620424213569L',
    'transaction:get --limit=10 --sort=amount:desc',
    'transaction:get --limit=10 --offset=5',
];
GetCommand.flags = Object.assign({}, base_1.default.flags, { state: command_1.flags.string(stateFlag), 'sender-id': command_1.flags.string(senderIdFlag), limit: command_1.flags.string({
        description: 'Limits the returned transactions array by specified integer amount. Maximum is 100.',
        default: '10',
    }), offset: command_1.flags.string({
        description: 'Offsets the returned transactions array by specified integer amount.',
        default: '0',
    }), sort: command_1.flags.string({
        description: 'Fields to sort results by.',
        default: 'timestamp:desc',
        options: SORT_OPTIONS,
    }) });
exports.default = GetCommand;
//# sourceMappingURL=get.js.map
