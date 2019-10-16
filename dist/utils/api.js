"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const phaeton_api_client_1 = require("phaeton-api-client");
const constants_1 = require("./constants");
const seedNodes = {
    main: phaeton_api_client_1.APIClient.constants.MAINNET_NODES,
    test: phaeton_api_client_1.APIClient.constants.TESTNET_NODES,
};
exports.getAPIClient = ({ nodes, network, }) => {
    const nethash = constants_1.NETHASHES[network] || network;
    const clientNodes = nodes && nodes.length > 0 ? nodes : seedNodes[network];
    return new phaeton_api_client_1.APIClient(clientNodes, { nethash });
};
//# sourceMappingURL=api.js.map
