import { MigrationValidation, MigrationValidationResult } from "./type-helpers/MigrationValidation";
import { Migration } from "../migration";
import { ChecksumStorage } from "../storages/ChecksumStorage";

export class ChecksumValidation implements MigrationValidation {

  private readonly validationName = `CHECKSUM`;
  private readonly checksumStorage: ChecksumStorage;

  constructor(checksumStorage: ChecksumStorage) {
    this.checksumStorage = checksumStorage;
  }

  async validate(migration: Migration): Promise<MigrationValidationResult> {
    const checksum = await this.checksumStorage.getChecksum(migration);
    if (!checksum || checksum === migration.checksum) {
      return {
        name: this.validationName,
        isValid: true
      };
    } else {
      return {
        name: this.validationName,
        isValid: false,
        validationError: `Invalid checksum for migration ${migration.file}`
      };
    }
  }

}
