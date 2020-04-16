import { UmzugStorage } from './type-helpers/umzug-storage';
import { MigrationProperties } from "../migration";
export interface JSONStorageConstructorOptions {
    /**
    Path to JSON file where the log is stored.

    @default './umzug.json'
    */
    readonly path?: string;
}
export declare class JSONStorage implements UmzugStorage {
    readonly path?: string;
    constructor(options?: JSONStorageConstructorOptions);
    logMigration(migrationProperties: MigrationProperties): Promise<void>;
    unlogMigration(migrationProperties: MigrationProperties): Promise<void>;
    executed(): Promise<string[]>;
}
