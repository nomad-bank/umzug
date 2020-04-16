import { Migration } from "../migration";
import { MigrationValidation, MigrationValidationResult } from "./type-helpers/MigrationValidation";
export declare class MigrationValidationManager {
    private readonly beforeExecuteValidations;
    constructor(beforeExecuteValidations?: Array<MigrationValidation>);
    registerBeforeExecuteValidation(validation: MigrationValidation): void;
    validateBeforeExecute(migration: Migration): Promise<Array<MigrationValidationResult>>;
}
