"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const phaeton_transactions_1 = require("phaeton-passphrase");
const command_1 = require("@oclif/command");
const base_1 = tslib_1.__importDefault(require("../../../base"));
const flags_1 = require("../../../utils/flags");
const helpers_1 = require("../../../utils/helpers");
const input_1 = require("../../../utils/input");
const processInputs = (lifetime, minimum, keysgroup) => ({ passphrase, secondPassphrase }) => phaeton_transactions_1.registerMultisignature({
    passphrase,
    secondPassphrase,
    keysgroup,
    lifetime,
    minimum,
});
class MultisignatureCommand extends base_1.default {
    async run() {
        const { args, flags: { passphrase: passphraseSource, 'second-passphrase': secondPassphraseSource, 'no-signature': noSignature, }, } = this.parse(MultisignatureCommand);
        const { lifetime, minimum, keysgroup: keysgroupStr } = args;
        const keysgroup = keysgroupStr.split(',');
        phaeton_transactions_1.utils.validatePublicKeys(keysgroup);
        helpers_1.validateLifetime(lifetime);
        helpers_1.validateMinimum(minimum);
        const transactionLifetime = parseInt(lifetime, 10);
        const transactionMinimumConfirmations = parseInt(minimum, 10);
        const processFunction = processInputs(transactionLifetime, transactionMinimumConfirmations, keysgroup);
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
MultisignatureCommand.args = [
    {
        name: 'lifetime',
        required: true,
        description: 'Number of hours the transaction should remain in the transaction pool before becoming invalid.',
    },
    {
        name: 'minimum',
        required: true,
        description: 'Minimum number of signatures required for a transaction from the account to be valid.',
    },
    {
        name: 'keysgroup',
        required: true,
        description: 'Public keys to verify signatures against for the multisignature group.',
    },
];
MultisignatureCommand.description = `
	Creates a transaction which will register the account as a multisignature account if broadcast to the network, using the following arguments:
		1. Number of hours the transaction should remain in the transaction pool before becoming invalid.
		2. Minimum number of signatures required for a transaction from the account to be valid.
		3. Public keys to verify signatures against for the multisignature group.
	`;
MultisignatureCommand.examples = [
    'transaction:create:multisignature 24 2 215b667a32a5cd51a94c9c2046c11fffb08c65748febec099451e3b164452bca,922fbfdd596fa78269bbcadc67ec2a1cc15fc929a19c462169568d7a3df1a1aa',
];
MultisignatureCommand.flags = Object.assign({}, base_1.default.flags, { passphrase: command_1.flags.string(flags_1.flags.passphrase), 'second-passphrase': command_1.flags.string(flags_1.flags.secondPassphrase), 'no-signature': command_1.flags.boolean(flags_1.flags.noSignature) });
exports.default = MultisignatureCommand;
//# sourceMappingURL=multisignature.js.map
