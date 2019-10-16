"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const phaeton_cryptography_1 = require("phaeton-cryptography");
const axios = tslib_1.__importStar(require("axios"));
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const tar = tslib_1.__importStar(require("tar"));
const commons_1 = require("./core/commons");
exports.verifyChecksum = async (filePath, expectedChecksum) => {
    const fileStream = fs_extra_1.default.createReadStream(filePath);
    const fileBuffer = await new Promise((resolve, reject) => {
        const bufferArray = [];
        fileStream.on('data', (d) => {
            bufferArray.push(d);
        });
        fileStream.on('error', error => {
            reject(error);
        });
        fileStream.on('end', () => {
            resolve(Buffer.concat(bufferArray));
        });
    });
    const fileChecksum = phaeton_cryptography_1.bufferToHex(phaeton_cryptography_1.hash(fileBuffer));
    if (fileChecksum !== expectedChecksum) {
        throw new Error(`file checksum: ${fileChecksum} mismatched with expected checksum: ${expectedChecksum}`);
    }
};
exports.download = async (url, cacheDir) => {
    const CACHE_EXPIRY_IN_DAYS = 2;
    const { filePath, fileDir } = commons_1.getDownloadedFileInfo(url, cacheDir);
    if (fs_extra_1.default.existsSync(filePath)) {
        if (commons_1.dateDiff(new Date(), fs_extra_1.default.statSync(filePath).birthtime) <=
            CACHE_EXPIRY_IN_DAYS) {
            return;
        }
        fs_extra_1.default.unlinkSync(filePath);
    }
    fs_extra_1.default.ensureDirSync(fileDir);
    const writeStream = fs_extra_1.default.createWriteStream(filePath);
    const response = await axios.default({
        url,
        method: 'GET',
        responseType: 'stream',
    });
    response.data.pipe(writeStream);
    return new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
    });
};
exports.extract = async (filePath, fileName, outDir) => tar.x({
    file: `${filePath}/${fileName}`,
    cwd: outDir,
    strip: 1,
});
exports.downloadAndValidate = async (url, cacheDir) => {
    await exports.download(url, cacheDir);
    await exports.download(`${url}.SHA256`, cacheDir);
    const { filePath } = commons_1.getDownloadedFileInfo(url, cacheDir);
    const content = fs_extra_1.default.readFileSync(`${filePath}.SHA256`, 'utf8');
    const checksum = content.split(' ')[0];
    await exports.verifyChecksum(filePath, checksum);
};
//# sourceMappingURL=download.js.map
