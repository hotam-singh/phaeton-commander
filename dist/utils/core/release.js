"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios = tslib_1.__importStar(require("axios"));
const constants_1 = require("../constants");
const commons_1 = require("./commons");
exports.getLatestVersion = async (url) => {
    const version = await axios.default.get(url);
    return version.data.trim();
};
exports.getReleaseInfo = async (releaseUrl, network, installVersion) => {
    if (releaseUrl && releaseUrl.search('.tar.gz') >= 0) {
        return {
            version: commons_1.getSemver(releaseUrl),
            phaetonTarUrl: releaseUrl,
            phaetonTarSHA256Url: `${releaseUrl}.SHA256`,
        };
    }
    const version = installVersion;
    const urlPath = `${constants_1.RELEASE_URL}/${network}/${version}`;
    const phaetonTarUrl = `${urlPath}/${commons_1.phaetonTar(version)}`;
    const phaetonTarSHA256Url = `${urlPath}/${commons_1.phaetonTarSHA256(version)}`;
    return { version, phaetonTarUrl, phaetonTarSHA256Url };
};
//# sourceMappingURL=release.js.map
