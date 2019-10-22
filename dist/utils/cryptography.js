"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cryptography = tslib_1.__importStar(require("phaeton-cryptography"));
exports.encryptMessage = ({ message, passphrase, recipient, }) => cryptography.encryptMessageWithPassphrase(message, passphrase, recipient);
exports.decryptMessage = ({ cipher, nonce, passphrase, senderPublicKey, }) => ({
    message: cryptography.decryptMessageWithPassphrase(cipher, nonce, passphrase, senderPublicKey),
});
exports.encryptPassphrase = ({ passphrase, password, }) => {
    const encryptedPassphraseObject = cryptography.encryptPassphraseWithPassword(passphrase, password);
    const encryptedPassphrase = cryptography.stringifyEncryptedPassphrase(encryptedPassphraseObject);
    return { encryptedPassphrase };
};
exports.decryptPassphrase = ({ encryptedPassphrase, password, }) => {
    const encryptedPassphraseObject = cryptography.parseEncryptedPassphrase(encryptedPassphrase);
    const passphrase = cryptography.decryptPassphraseWithPassword(encryptedPassphraseObject, password);
    return { passphrase };
};
exports.getKeys = cryptography.getKeys;
exports.getAddressFromPublicKey = (publicKey) => ({
    address: cryptography.getAddressFromPublicKey(publicKey),
});
exports.signMessage = ({ message, passphrase }) => cryptography.signMessageWithPassphrase(message, passphrase);
exports.verifyMessage = ({ publicKey, signature, message, }) => ({
    verified: cryptography.verifyMessageWithPublicKey({
        publicKey,
        signature,
        message,
    }),
});
//# sourceMappingURL=cryptography.js.map
