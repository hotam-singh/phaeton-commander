"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const phaeton_cryptography_1 = require("phaeton-cryptography");
const url_1 = tslib_1.__importDefault(require("url"));
const base_1 = tslib_1.__importDefault(require("../../base"));
const config_1 = require("../../utils/config");
const constants_1 = require("../../utils/constants");
const error_1 = require("../../utils/error");
const availableVariables = constants_1.CONFIG_VARIABLES.join(', ');
const WRITE_FAIL_WARNING = 'Config file could not be written: your changes will not be persisted.';
const NETHASH_ERROR_MESSAGE = 'Value must be a hex string with 64 characters, or one of main or test.';
const URL_ERROR_MESSAGE = `Node URLs must include a supported protocol (${constants_1.API_PROTOCOLS.map(protocol => protocol.replace(':', '')).join(', ')}) and a hostname. E.g. https://127.0.0.1:4000 or http://localhost.`;
const checkBoolean = (value) => ['true', 'false'].includes(value);
const setNestedConfigProperty = (config, path, value) => {
    const dotNotationArray = path.split('.');
    dotNotationArray.reduce((obj, pathComponent, i) => {
        if (i === dotNotationArray.length - 1) {
            if (obj === undefined) {
                throw new error_1.ValidationError(`Config file could not be written: property '${dotNotationArray.join('.')}' was not found. It looks like your configuration file is corrupted. Please check the file at ${process.env.XDG_CONFIG_HOME} or remove it (a fresh default configuration file will be created when you run Phaeton Commander again).`);
            }
            obj[pathComponent] = value;
            return config;
        }
        return obj[pathComponent];
    }, config);
};
const attemptWriteToFile = (newConfig, value, dotNotation) => {
    const writeSuccess = config_1.setConfig(process.env.XDG_CONFIG_HOME, newConfig);
    if (!writeSuccess) {
        throw new error_1.FileSystemError(WRITE_FAIL_WARNING);
    }
    const message = value === '' || (Array.isArray(value) && value.length === 0)
        ? `Successfully reset ${dotNotation}.`
        : `Successfully set ${dotNotation} to ${value}.`;
    const result = {
        message,
    };
    return result;
};
const setValue = (config, dotNotation, value) => {
    setNestedConfigProperty(config, dotNotation, value);
    return attemptWriteToFile(config, value, dotNotation);
};
const setBoolean = (config, dotNotation, value) => {
    if (!checkBoolean(value)) {
        throw new error_1.ValidationError('Value must be a boolean.');
    }
    const newValue = value === 'true';
    return setValue(config, dotNotation, newValue);
};
const setArrayURL = (config, dotNotation, _, inputs) => {
    inputs.forEach(input => {
        const { protocol, hostname } = url_1.default.parse(input);
        if (protocol === undefined ||
            !constants_1.API_PROTOCOLS.includes(protocol) ||
            !hostname) {
            throw new error_1.ValidationError(URL_ERROR_MESSAGE);
        }
    });
    return setValue(config, dotNotation, inputs);
};
const setNethash = (config, dotNotation, value) => {
    if (dotNotation === 'api.network' &&
        !Object.keys(constants_1.NETHASHES).includes(value)) {
        const NETHASH_LENGTH = 64;
        if (value.length !== NETHASH_LENGTH) {
            throw new error_1.ValidationError(NETHASH_ERROR_MESSAGE);
        }
        try {
            phaeton_cryptography_1.hexToBuffer(value, 'utf8');
        }
        catch (error) {
            throw new error_1.ValidationError(NETHASH_ERROR_MESSAGE);
        }
    }
    return setValue(config, dotNotation, value);
};
const handlers = {
    'api.nodes': setArrayURL,
    'api.network': setNethash,
    json: setBoolean,
    name: setValue,
    pretty: setBoolean,
};
class SetCommand extends base_1.default {
    async run() {
        const { args } = this.parse(SetCommand);
        const { variable, values: valuesStr = '' } = args;
        const values = valuesStr.split(',').filter(Boolean);
        const safeValues = values || [];
        const safeValue = safeValues[0] || '';
        const result = handlers[variable](this.userConfig, variable, safeValue, safeValues);
        this.print(result, true);
    }
}
SetCommand.args = [
    {
        name: 'variable',
        required: true,
        options: constants_1.CONFIG_VARIABLES,
        description: '',
    },
    {
        name: 'values',
        required: false,
        description: '',
    },
];
SetCommand.description = `
		Sets configuration.
		...
		Variables available: ${availableVariables}.
	`;
SetCommand.examples = [
    'config:set json true',
    'config:set api.network main',
    'config:set api.nodes https://127.0.0.1:4000,http://mynode.com:7000',
];
exports.default = SetCommand;
//# sourceMappingURL=set.js.map
