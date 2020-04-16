import { SequelizeType } from "./type-helpers/sequelize-type-helpers";
import { UmzugStorage } from "./type-helpers/umzug-storage";
import { MigrationProperties } from "../migration";
import { MigrationValidationManager } from "../validation/MigrationValidationManager";
interface ChecksumStorageConstructorOptions {
    /**
     The configured instance of Sequelize.
     */
    readonly sequelize: SequelizeType;
    /**
     The configured instance of Migration Validation Manager.
     */
    readonly migrationValidationManager: MigrationValidationManager;
    /**
     The name of the table. If omitted, defaults to the 'migrations'.
     */
    readonly tableName?: string;
    /**
     Name of the schema under which the table is to be created. If omitted, defaults to database default.
     */
    readonly schema?: any;
}
export declare class ChecksumStorage implements UmzugStorage {
    private readonly sequelize;
    private readonly model;
    constructor(options: ChecksumStorageConstructorOptions);
    executed(): Promise<string[]>;
    logMigration(migrationProperties: MigrationProperties): Promise<void>;
    unlogMigration(migrationProperties: MigrationProperties): Promise<void>;
    getChecksum(migrationProperties: MigrationProperties): Promise<string>;
}
export {};
