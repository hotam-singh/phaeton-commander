"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const fsExtra = tslib_1.__importStar(require("fs-extra"));
const listr_1 = tslib_1.__importDefault(require("listr"));
const semver_1 = tslib_1.__importDefault(require("semver"));
const base_1 = tslib_1.__importDefault(require("../../base"));
const constants_1 = require("../../utils/constants");
const cache_1 = require("../../utils/core/cache");
const commons_1 = require("../../utils/core/commons");
const database_1 = require("../../utils/core/database");
const pm2_1 = require("../../utils/core/pm2");
const release_1 = require("../../utils/core/release");
const download_1 = require("../../utils/download");
const flags_1 = require("../../utils/flags");
class UpgradeCommand extends base_1.default {
    async run() {
        const { args, flags } = this.parse(UpgradeCommand);
        const { name } = args;
        const { 'phaeton-version': phaetonVersion, 'release-url': releaseUrl, } = flags;
        const instance = await pm2_1.describeApplication(name);
        if (!instance) {
            throw new Error(`Phaeton Core instance: ${name} doesn't exists.\nTo upgrade first install using phaeton core:install and then run phaeton core:upgrade`);
        }
        const { installationPath, network, version: currentVersion, } = instance;
        const upgradeVersion = await commons_1.getVersionToInstall(network, phaetonVersion, releaseUrl);
        const { cacheDir } = this.config;
        fsExtra.ensureDirSync(cacheDir);
        const tasks = new listr_1.default([
            {
                title: 'Validate Version Input',
                task: async () => {
                    if (semver_1.default.lte(upgradeVersion, currentVersion)) {
                        throw new Error(`Upgrade version:${upgradeVersion} should be greater than current version: ${currentVersion}`);
                    }
                    const latestUrl = releaseUrl || commons_1.phaetonLatestUrl(constants_1.RELEASE_URL, network);
                    await commons_1.validateVersion(latestUrl, upgradeVersion);
                },
            },
            {
                title: `Download Phaeton Core: ${upgradeVersion} for upgrade`,
                task: async () => {
                    const { phaetonTarUrl } = await release_1.getReleaseInfo(releaseUrl, network, upgradeVersion);
                    await download_1.downloadAndValidate(phaetonTarUrl, cacheDir);
                },
            },
            {
                title: 'Stop, Backup and Install Phaeton Core',
                task: () => new listr_1.default([
                    {
                        title: `Stop Phaeton Core`,
                        task: async () => {
                            const isRunning = await cache_1.isCacheRunning(installationPath, name);
                            if (isRunning) {
                                await cache_1.stopCache(installationPath, network, name);
                            }
                            await database_1.stopDatabase(installationPath, name);
                            await pm2_1.stopApplication(name);
                        },
                    },
                    {
                        title: `Backup Phaeton Core: ${currentVersion} installed as ${name}`,
                        task: () => {
                            commons_1.backupPhaeton(installationPath, name);
                        },
                    },
                    {
                        title: `Install Phaeton Core: ${upgradeVersion}`,
                        task: async () => {
                            fsExtra.ensureDirSync(installationPath);
                            const { phaetonTarUrl } = await release_1.getReleaseInfo(releaseUrl, network, upgradeVersion);
                            const { fileDir, fileName } = commons_1.getDownloadedFileInfo(phaetonTarUrl, cacheDir);
                            await download_1.extract(fileDir, fileName, installationPath);
                        },
                    },
                ]),
            },
            {
                title: `Upgrade Phaeton Core ${name} instance from: ${currentVersion} to: ${upgradeVersion}`,
                task: async () => {
                    await commons_1.upgradePhaeton(installationPath, name, network, currentVersion);
                },
            },
            {
                title: 'Unregister and register Phaeton Core',
                task: async () => {
                    const envConfig = await commons_1.generateEnvConfig(network);
                    await pm2_1.unRegisterApplication(name);
                    await pm2_1.registerApplication(installationPath, network, name, envConfig);
                },
            },
            {
                title: `Start Phaeton Core: ${upgradeVersion}`,
                task: async () => {
                    const isRunning = await cache_1.isCacheRunning(installationPath, name);
                    if (!isRunning) {
                        await cache_1.startCache(installationPath, name);
                    }
                    await database_1.startDatabase(installationPath, name);
                    await pm2_1.restartApplication(name);
                },
            },
        ]);
        await tasks.run();
    }
}
UpgradeCommand.args = [
    {
        name: 'name',
        description: 'Phaeton Core installation directory name.',
        required: true,
    },
];
UpgradeCommand.description = 'Upgrade an instance of Phaeton Core to a specified or latest version.';
UpgradeCommand.examples = [
    'core:upgrade phaeton-mainnet',
    'core:upgrade --phaeton-version=2.0.0 phaeton-mainnet',
    'core:upgrade --release-url=https://downloads.phaeton.io/phaeton/mainnet/2.1.0/phaeton-2.1.0-Linux-x86_64.tar.gz phaeton-mainnet',
];
UpgradeCommand.flags = {
    json: command_1.flags.boolean(Object.assign({}, base_1.default.flags.json, { hidden: true })),
    pretty: command_1.flags.boolean(Object.assign({}, base_1.default.flags.pretty, { hidden: true })),
    'phaeton-version': command_1.flags.string(Object.assign({}, flags_1.flags.phaetonVersion)),
    'release-url': command_1.flags.string(Object.assign({}, flags_1.flags.releaseUrl)),
};
exports.default = UpgradeCommand;
//# sourceMappingURL=upgrade.js.map
