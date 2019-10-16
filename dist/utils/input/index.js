"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const passphraseModule = tslib_1.__importStar(require("phaeton-passphrase"));
const utils_1 = require("./utils");
exports.getFirstLineFromString = (multilineString) => typeof multilineString === 'string'
    ? multilineString.split(/[\r\n]+/)[0]
    : undefined;
exports.getInputsFromSources = async ({ passphrase: passphraseInput, secondPassphrase: secondPassphraseInput, password: passwordInput, data: dataInput, }) => {
    const [passphraseIsRequired, secondPassphraseIsRequired, passwordIsRequired, dataIsRequired,] = [passphraseInput, secondPassphraseInput, passwordInput, dataInput].map(input => !!input && input.source === 'stdin');
    const stdIn = await utils_1.getStdIn({
        passphraseIsRequired,
        secondPassphraseIsRequired,
        passwordIsRequired,
        dataIsRequired,
    });
    const passphrase = typeof stdIn.passphrase !== 'string' && passphraseInput
        ? await utils_1.getPassphrase(passphraseInput.source, {
            shouldRepeat: passphraseInput.repeatPrompt,
        })
        : stdIn.passphrase || undefined;
    const secondPassphrase = typeof stdIn.secondPassphrase !== 'string' && secondPassphraseInput
        ? await utils_1.getPassphrase(secondPassphraseInput.source, {
            displayName: 'your second secret passphrase',
            shouldRepeat: secondPassphraseInput.repeatPrompt,
        })
        : stdIn.secondPassphrase || undefined;
    const passphraseErrors = [passphrase, secondPassphrase]
        .filter(Boolean)
        .map(pass => passphraseModule.validation
        .getPassphraseValidationErrors(pass)
        .filter((error) => error.message));
    passphraseErrors.forEach(errors => {
        if (errors.length > 0) {
            const passphraseWarning = errors
                .filter((error) => error.code !== 'INVALID_MNEMONIC')
                .reduce((accumulator, error) => accumulator.concat(`${error.message.replace(' Please check the passphrase.', '')} `), 'Warning: ');
            console.warn(passphraseWarning);
        }
    });
    const password = typeof stdIn.password !== 'string' && passwordInput
        ? await utils_1.getPassphrase(passwordInput.source, {
            displayName: 'your password',
            shouldRepeat: passwordInput.repeatPrompt,
        })
        : stdIn.password || undefined;
    const data = typeof stdIn.data !== 'string' && dataInput
        ? await utils_1.getData(dataInput.source)
        : stdIn.data || undefined;
    return {
        passphrase,
        secondPassphrase,
        password,
        data,
    };
};
//# sourceMappingURL=index.js.map
