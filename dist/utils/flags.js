"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messageDescription = `Specifies a source for providing a message to the command. If a string is provided directly as an argument, this option will be ignored. The message must be provided via an argument or via this option. Sources must be one of \`file\` or \`stdin\`. In the case of \`file\`, a corresponding identifier must also be provided.
	Note: if both secret passphrase and message are passed via stdin, the passphrase must be the first line.
	Examples:
	- --message=file:/path/to/my/message.txt
	- --message=stdin
`;
const passphraseDescription = `Specifies a source for your secret passphrase. Phaeton Commander will prompt you for input if this option is not set.
	Source must be one of \`prompt\`, \`pass\`, \`env\`, \`file\` or \`stdin\`. For \`pass\`, \`env\` and \`file\` a corresponding identifier must also be provided.
	Examples:
	- --passphrase=prompt (default behaviour)
	- --passphrase='pass:my secret passphrase' (should only be used where security is not important)
	- --passphrase=env:SECRET_PASSPHRASE
	- --passphrase=file:/path/to/my/passphrase.txt (takes the first line only)
	- --passphrase=stdin (takes one line only)
`;
const secondPassphraseDescription = `Specifies a source for your second secret passphrase. For certain commands a second passphrase is necessary, in which case Phaeton Commander will prompt you for it if this option is not set. Otherwise, Phaeton Commander will assume you want to use one passphrase only.
	Source must be one of \`prompt\`, \`pass\`, \`env\`, \`file\` or \`stdin\`. For \`pass\`, \`env\` and \`file\` a corresponding identifier must also be provided.
	Examples:
	- --second-passphrase=prompt (to force a prompt even when a second passphrase is not always necessary)
	- --second-passphrase='pass:my second secret passphrase' (should only be used where security is not important)
	- --second-passphrase=env:SECOND_SECRET_PASSPHRASE
	- --second-passphrase=file:/path/to/my/secondPassphrase.txt (takes the first line only)
	- --second-passphrase=stdin (takes one line only)
`;
const passwordDescription = `Specifies a source for your secret password. Phaeton Commander will prompt you for input if this option is not set.
	Source must be one of \`prompt\`, \`pass\`, \`env\`, \`file\` or \`stdin\`. For \`pass\`, \`env\` and \`file\` a corresponding identifier must also be provided.
	Examples:
	- --password=prompt (default behaviour)
	- --password=pass:password123 (should only be used where security is not important)
	- --password=env:PASSWORD
	- --password=file:/path/to/my/password.txt (takes the first line only)
	- --password=stdin (takes the first line only)
`;
const votesDescription = `Specifies the public keys for the delegate candidates you want to vote for. Takes either a string of public keys separated by commas, or a path to a file which contains the public keys.
	Examples:
	- --votes=publickey1,publickey2
	- --votes=file:/path/to/my/votes.txt (every public key should be on a new line)
`;
const unvotesDescription = `Specifies the public keys for the delegate candidates you want to remove your vote from. Takes either a string of public keys separated by commas, or a path to a file which contains the public keys.
	Examples:
	- --unvotes=publickey1,publickey2
	- --unvotes=file:/path/to/my/unvotes.txt (every public key should be on a new line)
`;
const noSignatureDescription = 'Creates the transaction without a signature. Your passphrase will therefore not be required.';
const networkDescription = 'Phaeton Core network name.';
const installationPathDescription = 'Phaeton Core installation path.';
const releaseUrlDescription = 'Phaeton Core download URL.';
const snapshotUrlDescription = 'Phaeton Core blockchain snapshot URL.';
const noSnapshotDescription = 'Install Phaeton Core without a blockchain snapshot.';
const phaetonVersionDescription = 'Phaeton Core version.';
const noStartDescription = 'Install Phaeton Core without starting.';
exports.flags = {
    message: {
        char: 'm',
        description: messageDescription,
    },
    noSignature: {
        description: noSignatureDescription,
    },
    passphrase: {
        char: 'p',
        description: passphraseDescription,
    },
    secondPassphrase: {
        char: 's',
        description: secondPassphraseDescription,
    },
    password: {
        char: 'w',
        description: passwordDescription,
    },
    unvotes: {
        description: unvotesDescription,
    },
    votes: {
        description: votesDescription,
    },
    network: {
        char: 'n',
        description: networkDescription,
    },
    installationPath: {
        char: 'p',
        description: installationPathDescription,
    },
    releaseUrl: {
        char: 'r',
        description: releaseUrlDescription,
    },
    snapshotUrl: {
        char: 's',
        description: snapshotUrlDescription,
    },
    noSnapshot: {
        description: noSnapshotDescription,
    },
    phaetonVersion: {
        description: phaetonVersionDescription,
    },
    noStart: {
        description: noStartDescription,
    },
};
//# sourceMappingURL=flags.js.map
