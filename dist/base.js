"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const os_1 = tslib_1.__importDefault(require("os"));
const config_1 = require("./utils/config");
const config_2 = require("./utils/core/config");
const helpers_1 = require("./utils/helpers");
const print_1 = require("./utils/print");
process.env.PM2_HOME = config_2.defaultPhaetonPm2Path;
exports.defaultConfigFolder = '.phaeton';
const jsonDescription = 'Prints output in JSON format. You can change the default behaviour in your config.json file.';
const prettyDescription = 'Prints JSON in pretty format rather than condensed. Has no effect if the output is set to table. You can change the default behaviour in your config.json file.';
class BaseCommand extends command_1.Command {
    constructor() {
        super(...arguments);
        this.printFlags = {};
        this.userConfig = {
            api: {
                network: 'main',
                nodes: [],
            },
            json: true,
            pretty: true,
        };
    }
    async finally(error) {
        if (error) {
            this.error(error instanceof Error ? error.message : error);
        }
    }
    async init() {
        const { flags } = this.parse(this.constructor);
        this.printFlags = flags;
        process.stdout.on('error', helpers_1.handleEPIPE);
        process.env.XDG_CONFIG_HOME =
            process.env.PHAETON_COMMANDER_CONFIG_DIR ||
                `${os_1.default.homedir()}/${exports.defaultConfigFolder}`;
        this.userConfig = config_1.getConfig(process.env.XDG_CONFIG_HOME);
    }
    print(result, readAgain = false) {
        if (readAgain) {
            this.userConfig = config_1.getConfig(process.env.XDG_CONFIG_HOME);
        }
        print_1.print(Object.assign({ json: this.userConfig.json, pretty: this.userConfig.pretty }, this.printFlags)).call(this, result);
    }
}
BaseCommand.flags = {
    json: command_1.flags.boolean({
        char: 'j',
        description: jsonDescription,
        allowNo: true,
    }),
    pretty: command_1.flags.boolean({
        description: prettyDescription,
        allowNo: true,
    }),
};
exports.default = BaseCommand;
//# sourceMappingURL=base.js.map
