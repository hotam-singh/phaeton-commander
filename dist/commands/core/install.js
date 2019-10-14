"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("@oclif/command");
const fsExtra = tslib_1.__importStar(require("fs-extra"));
const listr_1 = tslib_1.__importDefault(require("listr"));
const os = tslib_1.__importStar(require("os"));
const base_1 = tslib_1.__importDefault(require("../../base"));
const constants_1 = require("../../utils/constants");
const commons_1 = require("../../utils/core/commons");
const database_1 = require("../../utils/core/database");
const pm2_1 = require("../../utils/core/pm2");
const release_1 = require("../../utils/core/release");
const download_1 = require("../../utils/download");
const flags_1 = require("../../utils/flags");
const start_1 = tslib_1.__importDefault(require("./start"));
const validatePrerequisite = (installPath) => {
    if (!commons_1.isSupportedOS()) {
        throw new Error(`Phaeton Core installation is not supported on ${os.type()}.`);
    }
    if (fsExtra.pathExistsSync(installPath)) {
        throw new Error(`Phaeton Core installation already exists in path ${installPath}.`);
    }
};
const validateFlags = ({ network, 'release-url': releaseUrl, 'snapshot-url': snapshotUrl, }) => {
    commons_1.validateNetwork(network);
    if (releaseUrl) {
        commons_1.validURL(releaseUrl);
    }
    if (snapshotUrl) {
        commons_1.validURL(snapshotUrl);
    }
};
const installOptions = async ({ 'installation-path': installationPath, network, 'release-url': releaseUrl, 'phaeton-version': phaetonVersion, }, name) => {
    const installPath = commons_1.phaetonInstall(installationPath);
    const installDir = `${installPath}/${name}/`;
    const latestUrl = releaseUrl || commons_1.phaetonLatestUrl(constants_1.RELEASE_URL, network);
    const installVersion = await commons_1.getVersionToInstall(network, phaetonVersion, releaseUrl);
    const { version, phaetonTarUrl, phaetonTarSHA256Url } = await release_1.getReleaseInfo(latestUrl, network, installVersion);
    return {
        installDir,
        version,
        phaetonTarUrl,
        phaetonTarSHA256Url,
        latestUrl,
    };
};
class InstallCommand extends base_1.default {
    async run() {
        const { args, flags } = this.parse(InstallCommand);
        const { 'phaeton-version': phaetonVersion, 'no-snapshot': noSnapshot, 'no-start': noStart, network, 'snapshot-url': snapshotUrl, } = flags;
        const { name } = args;
        const { cacheDir } = this.config;
        fsExtra.ensureDirSync(cacheDir);
        const snapshotURL = commons_1.phaetonSnapshotUrl(snapshotUrl, network);
        const tasks = new listr_1.default([
            {
                title: `Install Phaeton Core ${network} instance as ${name}`,
                task: () => new listr_1.default([
                    {
                        title: 'Prepare Install Options',
                        task: async (ctx) => {
                            const options = await installOptions(flags, name);
                            ctx.options = options;
                        },
                    },
                    {
                        title: 'Validate root user, flags, prerequisites',
                        task: async (ctx) => {
                            const { installDir, latestUrl } = ctx.options;
                            commons_1.validateNotARootUser();
                            validateFlags(flags);
                            validatePrerequisite(installDir);
                            if (phaetonVersion) {
                                await commons_1.validateVersion(latestUrl, phaetonVersion);
                                ctx.options.version = phaetonVersion;
                            }
                        },
                    },
                    {
                        title: 'Download Phaeton Core Release and Blockchain Snapshot',
                        task: async (ctx) => {
                            const { phaetonTarUrl } = ctx.options;
                            if (!noSnapshot && snapshotURL.trim() !== '') {
                                await download_1.download(snapshotURL, cacheDir);
                            }
                            await download_1.downloadAndValidate(phaetonTarUrl, cacheDir);
                        },
                    },
                    {
                        title: 'Extract Phaeton Core',
                        task: async (ctx) => {
                            const { installDir, phaetonTarUrl } = ctx.options;
                            const { fileName, fileDir } = commons_1.getDownloadedFileInfo(phaetonTarUrl, cacheDir);
                            commons_1.createDirectory(installDir);
                            await download_1.extract(fileDir, fileName, installDir);
                        },
                    },
                    {
                        title: 'Register Phaeton Core',
                        task: async (ctx) => {
                            const { installDir } = ctx.options;
                            const envConfig = await commons_1.generateEnvConfig(network);
                            await pm2_1.registerApplication(installDir, network, name, envConfig);
                        },
                    },
                    {
                        title: 'Create Database and restore Phaeton Blockchain Snapshot',
                        task: async (ctx) => {
                            const { installDir } = ctx.options;
                            await database_1.initDB(installDir);
                            await database_1.startDatabase(installDir, name);
                            await database_1.createUser(installDir, network, name);
                            await database_1.createDatabase(installDir, network, name);
                            if (!noSnapshot) {
                                const { filePath } = commons_1.getDownloadedFileInfo(snapshotURL, cacheDir);
                                await database_1.restoreSnapshot(installDir, network, filePath, name);
                            }
                            await database_1.stopDatabase(installDir, name);
                        },
                    },
                ]),
            },
        ]);
        try {
            const instance = await pm2_1.describeApplication(name);
            if (instance) {
                this.log(`\n Phaeton Core instance ${name} already installed: `);
                this.print(instance);
                return;
            }
            await tasks.run();
            if (!noStart) {
                await start_1.default.run([name]);
                const newInstance = await pm2_1.describeApplication(name);
                this.print(newInstance);
                return;
            }
        }
        catch (error) {
            this.error(JSON.stringify(error));
            const { installDir } = error.context.options;
            const dirPath = installDir.substr(0, installDir.length - 1);
            fsExtra.emptyDirSync(installDir);
            fsExtra.rmdirSync(dirPath);
        }
    }
}
InstallCommand.args = [
    {
        name: 'name',
        description: 'Phaeton Core installation directory name.',
        required: true,
    },
];
InstallCommand.description = 'Install an instance of Phaeton Core.';
InstallCommand.examples = [
    'core:install phaeton-mainnet',
    'core:install --no-start phaeton-mainnet',
    'core:install --no-snapshot phaeton-mainnet',
    'core:install --phaeton-version=2.0.0 phaeton-mainnet',
    'core:install --network=testnet --release-url=https://downloads.phaeton.io/phaeton/mainnet/1.6.0/phaeton-1.6.0-Linux-x86_64.tar.gz phaeton-mainnet',
    'core:install --network=mainnet --snapshot-url=https://downloads.phaeton.io/phaeton/mainnet/blockchain.db.gz custom-mainnet',
];
InstallCommand.flags = {
    json: command_1.flags.boolean(Object.assign({}, base_1.default.flags.json, { hidden: true })),
    pretty: command_1.flags.boolean(Object.assign({}, base_1.default.flags.pretty, { hidden: true })),
    'installation-path': command_1.flags.string(Object.assign({}, flags_1.flags.installationPath, { default: '~/.phaeton/instances', hidden: true })),
    'phaeton-version': command_1.flags.string(Object.assign({}, flags_1.flags.phaetonVersion)),
    'no-snapshot': command_1.flags.boolean(Object.assign({}, flags_1.flags.noSnapshot, { default: false, allowNo: false })),
    'no-start': command_1.flags.boolean(Object.assign({}, flags_1.flags.noStart, { default: false, allowNo: false })),
    network: command_1.flags.string(Object.assign({}, flags_1.flags.network, { default: constants_1.NETWORK.MAINNET, options: [
            constants_1.NETWORK.MAINNET,
            constants_1.NETWORK.TESTNET,
            constants_1.NETWORK.BETANET,
            constants_1.NETWORK.ALPHANET,
            constants_1.NETWORK.DEVNET,
        ] })),
    'release-url': command_1.flags.string(Object.assign({}, flags_1.flags.releaseUrl)),
    'snapshot-url': command_1.flags.string(Object.assign({}, flags_1.flags.snapshotUrl, { default: constants_1.SNAPSHOT_URL })),
};
exports.default = InstallCommand;
//# sourceMappingURL=install.js.map
