"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChecksumValidation {
    constructor(checksumStorage) {
        this.validationName = `CHECKSUM`;
        this.checksumStorage = checksumStorage;
    }
    async validate(migration) {
        const checksum = await this.checksumStorage.getChecksum(migration);
        if (!checksum || checksum === migration.checksum) {
            return {
                name: this.validationName,
                isValid: true
            };
        }
        else {
            return {
                name: this.validationName,
                isValid: false,
                validationError: `Invalid checksum for migration ${migration.file}`
            };
        }
    }
}
exports.ChecksumValidation = ChecksumValidation;
//# sourceMappingURL=ChecksumValidation.js.map