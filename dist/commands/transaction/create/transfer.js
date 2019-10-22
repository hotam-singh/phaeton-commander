"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const phaeton_transactions_1 = require("phaeton-passphrase");
const command_1 = require("@oclif/command");
const base_1 = tslib_1.__importDefault(require("../../../base"));
const flags_1 = require("../../../utils/flags");
const input_1 = require("../../../utils/input");
const dataFlag = {
    char: 'd',
    description: `Optional UTF8 encoded data (maximum of 64 bytes) to include in the transaction asset.
	Examples:
	- --data=customInformation
`,
};
const processInputs = (amount, address, data) => ({ passphrase, secondPassphrase, }) => phaeton_transactions_1.transfer({
    recipientId: address,
    amount,
    data,
    passphrase,
    secondPassphrase,
});
class TransferCommand extends base_1.default {
    async run() {
        const { args, flags: { passphrase: passphraseSource, 'second-passphrase': secondPassphraseSource, 'no-signature': noSignature, data: dataString, }, } = this.parse(TransferCommand);
        const { amount, address } = args;
        phaeton_transactions_1.utils.validateAddress(address);
        const normalizedAmount = phaeton_transactions_1.utils.convertPHAToBeddows(amount);
        const processFunction = processInputs(normalizedAmount, address, dataString);
        if (noSignature) {
            const noSignatureResult = processFunction({
                passphrase: undefined,
                secondPassphrase: undefined,
            });
            this.print(noSignatureResult);
            return;
        }
        const inputs = await input_1.getInputsFromSources({
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
        const result = processFunction(inputs);
        this.print(result);
    }
}
TransferCommand.args = [
    {
        name: 'amount',
        required: true,
        description: 'Amount of PHA to send.',
    },
    {
        name: 'address',
        required: true,
        description: 'Address of the recipient.',
    },
];
TransferCommand.description = `
	Creates a transaction which will transfer the specified amount to an address if broadcast to the network.
		`;
TransferCommand.examples = ['transaction:create:transfer 100 13356260975429434553L'];
TransferCommand.flags = Object.assign({}, base_1.default.flags, { passphrase: command_1.flags.string(flags_1.flags.passphrase), 'second-passphrase': command_1.flags.string(flags_1.flags.secondPassphrase), 'no-signature': command_1.flags.boolean(flags_1.flags.noSignature), data: command_1.flags.string(dataFlag) });
exports.default = TransferCommand;
//# sourceMappingURL=transfer.js.map
