"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const worker_process_1 = require("../worker-process");
const config_1 = require("./config");
const pm2_1 = require("./pm2");
const DATABASE_START_SUCCESS = '[+] Postgresql started successfully.';
const DATABASE_START_FAILURE = '[-] Failed to start Postgresql.';
const DATABASE_STOP_SUCCESS = '[+] Postgresql stopped successfully.';
const DATABASE_STOP_FAILURE = '[-] Postgresql failed to stop.';
const DATABASE_USER_SUCCESS = '[+] Postgresql user created successfully.';
const DATABASE_USER_FAILURE = '[-] Failed to create Postgresql user.';
const DATABASE_CREATE_SUCCESS = '[+] Postgresql database created successfully.';
const DATABASE_CREATE_FAILURE = '[-] Failed to create Postgresql database.';
const DATABASE_STATUS = '[+] Postgresql is not running.';
const RESTORE_SNAPSHOT_SUCCESS = '[+] Blockchain restored successfully.';
const RESTORE_SNAPSHOT_FAILURE = '[-] Failed to restore blockchain.';
const DB_DATA = 'pgsql/data';
const DB_LOG_FILE = 'logs/pgsql.log';
const PG_BIN = './pgsql/bin';
const PG_CTL = `${PG_BIN}/pg_ctl`;
const isDbInitialized = (installDir) => fs_1.default.existsSync(`${installDir}/${DB_DATA}`);
const isDbRunning = async (installDir, port) => {
    const { stderr } = await worker_process_1.exec(`${PG_CTL} --pgdata ${DB_DATA} --options '-F -p ${port}' status`, { cwd: installDir });
    return !stderr;
};
exports.initDB = async (installDir) => {
    if (isDbInitialized(installDir)) {
        return 'Postgres database initialized';
    }
    const { stderr } = await worker_process_1.exec(`${PG_CTL} initdb --pgdata ${DB_DATA}`, { cwd: installDir });
    if (!stderr) {
        return DATABASE_START_SUCCESS;
    }
    throw new Error(`${DATABASE_START_FAILURE}: \n\n ${stderr}`);
};
exports.startDatabase = async (installDir, name) => {
    const { dbPort } = (await pm2_1.describeApplication(name));
    const isRunning = await isDbRunning(installDir, dbPort);
    if (isRunning) {
        return DATABASE_START_SUCCESS;
    }
    const { stderr } = await worker_process_1.exec(`${PG_CTL} --wait --pgdata ${DB_DATA} --log ${DB_LOG_FILE} --options "-F -p ${dbPort}" start`, { cwd: installDir });
    if (!stderr) {
        return DATABASE_START_SUCCESS;
    }
    throw new Error(`${DATABASE_START_FAILURE}: \n\n ${stderr}`);
};
exports.createUser = async (installDir, network, name) => {
    try {
        const { components: { storage: { user, password }, }, } = await config_1.getPhaetonConfig(installDir, network);
        const { dbPort } = (await pm2_1.describeApplication(name));
        const { stderr } = await worker_process_1.exec(`${PG_BIN}/dropuser --if-exists ${user} --port ${dbPort};
			${PG_BIN}/createuser --createdb ${user} --port ${dbPort};
			${PG_BIN}/psql --quiet --dbname postgres --port ${dbPort} --command "ALTER USER ${user} WITH PASSWORD '${password}';";`, { cwd: installDir });
        if (!stderr) {
            return DATABASE_USER_SUCCESS;
        }
        throw new Error(`${DATABASE_USER_FAILURE}: \n\n ${stderr}`);
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.createDatabase = async (installDir, network, name) => {
    try {
        const { components: { storage: { database }, }, } = await config_1.getPhaetonConfig(installDir, network);
        const { dbPort } = (await pm2_1.describeApplication(name));
        const { stderr } = await worker_process_1.exec(`${PG_BIN}/dropdb --if-exists ${database} --port ${dbPort};
			${PG_BIN}/createdb ${database} --port ${dbPort};
			`, { cwd: installDir });
        if (!stderr) {
            return DATABASE_CREATE_SUCCESS;
        }
        throw new Error(`${DATABASE_CREATE_FAILURE}: \n\n ${stderr}`);
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.stopDatabase = async (installDir, name) => {
    const { dbPort } = (await pm2_1.describeApplication(name));
    const isRunning = await isDbRunning(installDir, dbPort);
    if (!isRunning) {
        return DATABASE_STATUS;
    }
    const { stderr } = await worker_process_1.exec(`${PG_CTL} --pgdata ${DB_DATA} --log ${DB_LOG_FILE} stop`, { cwd: installDir });
    if (!stderr) {
        return DATABASE_STOP_SUCCESS;
    }
    throw new Error(`${DATABASE_STOP_FAILURE}: \n\n ${stderr}`);
};
exports.restoreSnapshot = async (installDir, network, snapshotFilePath, name) => {
    try {
        const { components: { storage: { database, user }, }, } = await config_1.getPhaetonConfig(installDir, network);
        const { dbPort } = (await pm2_1.describeApplication(name));
        const { stderr } = await worker_process_1.exec(`gunzip --force --stdout --quiet ${snapshotFilePath} | ${PG_BIN}/psql --username ${user} --dbname ${database} --port ${dbPort};`, { cwd: installDir });
        if (!stderr) {
            return RESTORE_SNAPSHOT_SUCCESS;
        }
        throw new Error(`${RESTORE_SNAPSHOT_FAILURE}: \n\n ${stderr}`);
    }
    catch (error) {
        throw new Error(error);
    }
};
//# sourceMappingURL=database.js.map
