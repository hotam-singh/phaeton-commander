"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const os = tslib_1.__importStar(require("os"));
const semver_1 = tslib_1.__importDefault(require("semver"));
const constants_1 = require("../constants");
const worker_process_1 = require("../worker-process");
const config_1 = require("./config");
const pm2_1 = require("./pm2");
const release_1 = require("./release");
exports.phaetonInstall = (installPath) => installPath.replace('~', os.homedir);
exports.installDirectory = (installPath, name) => `${exports.phaetonInstall(installPath)}/${name}`;
exports.phaetonVersion = (version) => `phaeton-${version}-${os.type()}-x86_64`;
exports.phaetonTar = (version) => `${exports.phaetonVersion(version)}.tar.gz`;
exports.phaetonTarSHA256 = (version) => `${exports.phaetonTar(version)}.SHA256`;
exports.phaetonLatestUrl = (url, network) => `${url}/${network}/latest.txt`;
exports.phaetonSnapshotUrl = (url, network) => {
    if (!['testnet', 'mainnet'].includes(network.toLowerCase()) &&
        url === constants_1.SNAPSHOT_URL) {
        return '';
    }
    if (url && url.search(constants_1.RELEASE_URL) >= 0 && url.search('db.gz') >= 0) {
        return `${constants_1.RELEASE_URL}/${network}/blockchain.db.gz`;
    }
    return url;
};
exports.logsDir = (installPath) => `${exports.phaetonInstall(installPath)}/logs`;
exports.SH_LOG_FILE = 'logs/phaeton.out';
exports.validateNotARootUser = () => {
    if (process.getuid && process.getuid() === 0) {
        throw new Error('Error: Phaeton should not be run be as root. Exiting.');
    }
};
exports.isSupportedOS = () => os.type() in constants_1.OS;
exports.validateNetwork = (network) => {
    if (network.toUpperCase() in constants_1.NETWORK) {
        return;
    }
    throw new Error(`Network "${network}" is not supported, please try options ${Object.values(constants_1.NETWORK).join(',')}`);
};
exports.createDirectory = (dirPath) => {
    const resolvedPath = exports.phaetonInstall(dirPath);
    if (!fs_extra_1.default.pathExistsSync(resolvedPath)) {
        fs_extra_1.default.ensureDirSync(resolvedPath);
    }
};
exports.validURL = (url) => {
    const isValid = new RegExp(/^(ftp|http|https):\/\/[^ "]+$/);
    if (isValid.test(url)) {
        return;
    }
    throw new Error(`Invalid URL: ${url}`);
};
exports.getSemver = (str) => {
    const exp = new RegExp(/(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-(?:[1-9]\d*|[\da-z-]*[a-z-][\da-z-]*)(?:\.(?:[1-9]\d*|[\da-z-]*[a-z][\da-z]*))*)?\.?(?:0|[1-9]\d*)?/);
    const result = exp.exec(str);
    return result[0];
};
exports.getVersionToInstall = async (network, version, releaseUrl) => {
    if (!version) {
        if (releaseUrl) {
            return exports.getSemver(releaseUrl);
        }
        else {
            const url = `${constants_1.RELEASE_URL}/${network}/latest.txt`;
            const latestVersion = await release_1.getLatestVersion(url);
            return latestVersion;
        }
    }
    return version;
};
exports.backupPhaeton = (installDir, instanceName) => {
    const backupPath = `${config_1.defaultBackupPath}/${instanceName}`;
    fs_extra_1.default.removeSync(backupPath);
    fs_extra_1.default.moveSync(installDir, backupPath);
};
exports.upgradePhaeton = async (installDir, name, network, currentVersion) => {
    const PHAETON_BACKUP = `${config_1.defaultBackupPath}/${name}`;
    const PHAETON_OLD_PG = `${PHAETON_BACKUP}/pgsql/data`;
    const PHAETON_PG = `${installDir}/pgsql/data`;
    const MODE = 0o700;
    fs_extra_1.default.mkdirSync(PHAETON_PG, MODE);
    fs_extra_1.default.copySync(PHAETON_OLD_PG, PHAETON_PG);
    const { stderr } = await worker_process_1.exec(`${installDir}/bin/node ${installDir}/scripts/update_config.js --network ${network} --output ${installDir}/config.json ${PHAETON_BACKUP}/config.json ${currentVersion}`);
    if (stderr) {
        throw new Error(stderr);
    }
};
exports.validateVersion = async (releaseUrl, version) => {
    if (!semver_1.default.valid(version)) {
        throw new Error(`Upgrade version: ${version} has invalid semver format`);
    }
    try {
        await release_1.getLatestVersion(releaseUrl);
    }
    catch (error) {
        if (error.message === 'Request failed with status code 404') {
            throw new Error(`Upgrade version: ${version} doesn't exists in ${constants_1.RELEASE_URL}`);
        }
        throw new Error(error.message);
    }
};
exports.dateDiff = (date1, date2) => {
    const MINUTES_OR_SECONDS = 60;
    const HOURS = 24;
    const INT_RANGE = 1000;
    return ((new Date(date1).valueOf() - new Date(date2).valueOf()) /
        (HOURS * MINUTES_OR_SECONDS * MINUTES_OR_SECONDS * INT_RANGE));
};
exports.getDownloadedFileInfo = (url, cacheDir) => {
    const pathWithoutProtocol = url.replace(/(^\w+:|^)\/\//, '').split('/');
    const fileName = pathWithoutProtocol.pop();
    const fileDir = `${cacheDir}/${pathWithoutProtocol.join('/')}`;
    const filePath = `${fileDir}/${fileName}`;
    return {
        fileName,
        fileDir,
        filePath,
    };
};
const convertToNumber = (val) => {
    if (!val) {
        return 0;
    }
    if (typeof val === 'number') {
        return val;
    }
    return parseInt(val, 10);
};
const getEnvByKey = (instances, key, defaultValue) => {
    const maxValue = instances
        .map(app => app[key])
        .reduce((acc, curr) => {
        const ac = convertToNumber(acc);
        const cu = convertToNumber(curr);
        return Math.max(ac, cu);
    }, defaultValue);
    return convertToNumber(maxValue) || defaultValue;
};
exports.generateEnvConfig = async (network) => {
    const INCREMENT = 2;
    const instances = await pm2_1.listApplication();
    const filteredByNetwork = instances.filter(i => i.network === network);
    return {
        PHAETON_DB_PORT: getEnvByKey(instances, 'dbPort', constants_1.POSTGRES_PORT) + 1,
        PHAETON_REDIS_PORT: getEnvByKey(instances, 'redisPort', constants_1.REDIS_PORT) + 1,
        PHAETON_HTTP_PORT: getEnvByKey(filteredByNetwork, 'httpPort', constants_1.HTTP_PORTS[network]) +
            INCREMENT,
        PHAETON_WS_PORT: getEnvByKey(filteredByNetwork, 'wsPort', constants_1.WS_PORTS[network]) + INCREMENT,
    };
};
//# sourceMappingURL=commons.js.map
