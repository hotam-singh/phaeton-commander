"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const base_1 = tslib_1.__importDefault(require("../../base"));
const api_1 = require("../../utils/api");
const error_1 = require("../../utils/error");
const utils_1 = require("../../utils/input/utils");
const getSignatureInput = async () => {
    try {
        const { data } = await utils_1.getStdIn({ dataIsRequired: true });
        if (!data) {
            throw new error_1.ValidationError('No signature was provided.');
        }
        return data;
    }
    catch (e) {
        throw new error_1.ValidationError('No signature was provided.');
    }
};
class BroadcastCommand extends base_1.default {
    async run() {
        const { args } = this.parse(BroadcastCommand);
        const { signature } = args;
        const signatureInput = signature || (await getSignatureInput());
        let signatureObject;
        try {
            signatureObject = JSON.parse(signatureInput);
        }
        catch (error) {
            throw new error_1.ValidationError('Could not parse signature JSON. Did you use the `--json` option?');
        }
        const client = api_1.getAPIClient(this.userConfig.api);
        const response = await client.signatures.broadcast(signatureObject);
        this.print(response.data);
    }
}
BroadcastCommand.args = [
    {
        name: 'signature',
        description: 'Signature to broadcast.',
    },
];
BroadcastCommand.description = `
	Broadcasts a signature for a transaction from a multisignature account.
	Accepts a stringified JSON signature as an argument, or a signature can be piped from a previous command.
	If piping make sure to quote out the entire command chain to avoid piping-related conflicts in your shell.
	`;
BroadcastCommand.examples = [
    'signature:broadcast \'{"transactionId":"abcd1234","publicKey":"abcd1234","signature":"abcd1234"}\'',
    'echo \'{"transactionId":"abcd1234","publicKey":"abcd1234","signature":"abcd1234"}\' | phaeton signature:broadcast',
];
BroadcastCommand.lags = Object.assign({}, base_1.default.flags);
exports.default = BroadcastCommand;
//# sourceMappingURL=broadcast.js.map
