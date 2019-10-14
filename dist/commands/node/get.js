"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const base_1 = tslib_1.__importDefault(require("../../base"));
const api_1 = require("../../utils/api");
class GetCommand extends base_1.default {
    async run() {
        const { flags: { 'forging-status': showForgingStatus }, } = this.parse(GetCommand);
        const client = api_1.getAPIClient(this.userConfig.api);
        const baseInfo = await Promise.all([
            client.node.getConstants(),
            client.node.getStatus(),
        ]).then(([constantsResponse, statusResponse]) => (Object.assign({}, constantsResponse.data, statusResponse.data)));
        if (!showForgingStatus) {
            this.print(baseInfo);
            return;
        }
        const fullInfo = await client.node
            .getForgingStatus()
            .then(forgingResponse => (Object.assign({}, baseInfo, { forgingStatus: forgingResponse.data || [] })))
            .catch(error => (Object.assign({}, baseInfo, { forgingStatus: error.message })));
        this.print(fullInfo);
    }
}
GetCommand.description = `Get the network status from a Phaeton Core instance.`;
GetCommand.examples = ['node:get', 'node:get --forging-status'];
GetCommand.flags = Object.assign({}, base_1.default.flags, { 'forging-status': command_1.flags.boolean({
        description: 'Additionally provides information about forging status.',
    }) });
exports.default = GetCommand;
//# sourceMappingURL=get.js.map
