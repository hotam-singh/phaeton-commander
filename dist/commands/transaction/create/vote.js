"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const phaeton_transactions_1 = require("phaeton-transactions");
const command_1 = require("@oclif/command");
const base_1 = tslib_1.__importDefault(require("../../../base"));
const error_1 = require("../../../utils/error");
const flags_1 = require("../../../utils/flags");
const input_1 = require("../../../utils/input");
const utils_1 = require("../../../utils/input/utils");
const processInputs = (votes, unvotes) => ({ passphrase, secondPassphrase }) => phaeton_transactions_1.castVotes({
    passphrase,
    votes,
    unvotes,
    secondPassphrase,
});
const processVotesInput = async (votes) => votes.includes(':') ? utils_1.getData(votes) : votes;
const processVotes = (votes) => votes
    .replace(/\n/g, ',')
    .split(',')
    .filter(Boolean)
    .map(vote => vote.trim());
const validatePublicKeys = (inputs) => {
    phaeton_transactions_1.utils.validatePublicKeys(inputs);
    return inputs;
};
class VoteCommand extends base_1.default {
    async run() {
        const { flags: { passphrase: passphraseSource, 'second-passphrase': secondPassphraseSource, 'no-signature': noSignature, votes, unvotes, }, } = this.parse(VoteCommand);
        if (!votes && !unvotes) {
            throw new error_1.ValidationError('At least one of votes and/or unvotes options must be provided.');
        }
        if (votes === unvotes) {
            throw new error_1.ValidationError('Votes and unvotes sources must not be the same.');
        }
        const processedVotesInput = votes
            ? await processVotesInput(votes.toString())
            : undefined;
        const processedUnvotesInput = unvotes
            ? await processVotesInput(unvotes.toString())
            : undefined;
        const validatedVotes = processedVotesInput
            ? validatePublicKeys(processVotes(processedVotesInput))
            : [];
        const validatedUnvotes = processedUnvotesInput
            ? validatePublicKeys(processVotes(processedUnvotesInput))
            : [];
        const processFunction = processInputs(validatedVotes, validatedUnvotes);
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
VoteCommand.description = `
	Creates a transaction which will cast votes (or unvotes) for delegate candidates using their public keys if broadcast to the network.
	`;
VoteCommand.examples = [
    'transaction:create:vote --votes 215b667a32a5cd51a94c9c2046c11fffb08c65748febec099451e3b164452bca,922fbfdd596fa78269bbcadc67ec2a1cc15fc929a19c462169568d7a3df1a1aa --unvotes e01b6b8a9b808ec3f67a638a2d3fa0fe1a9439b91dbdde92e2839c3327bd4589,ac09bc40c889f688f9158cca1fcfcdf6320f501242e0f7088d52a5077084ccba',
];
VoteCommand.flags = Object.assign({}, base_1.default.flags, { passphrase: command_1.flags.string(flags_1.flags.passphrase), 'second-passphrase': command_1.flags.string(flags_1.flags.secondPassphrase), 'no-signature': command_1.flags.boolean(flags_1.flags.noSignature), votes: command_1.flags.string(flags_1.flags.votes), unvotes: command_1.flags.string(flags_1.flags.unvotes) });
exports.default = VoteCommand;
//# sourceMappingURL=vote.js.map
