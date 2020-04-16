import { MigrationValidation, MigrationValidationResult } from "./type-helpers/MigrationValidation";
import { Migration } from "../migration";
import { ChecksumStorage } from "../storages/ChecksumStorage";
export declare class ChecksumValidation implements MigrationValidation {
    private readonly validationName;
    private readonly checksumStorage;
    constructor(checksumStorage: ChecksumStorage);
    validate(migration: Migration): Promise<MigrationValidationResult>;
}
