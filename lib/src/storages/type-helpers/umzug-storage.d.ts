import { MigrationProperties } from "../../migration";
export interface UmzugStorage {
    /**
    Logs migration to be considered as executed.
    */
    logMigration(migrationProperties: MigrationProperties): Promise<void>;
    /**
    Unlogs migration (makes it to be considered as pending).
    */
    unlogMigration(migrationProperties: MigrationProperties): Promise<void>;
    /**
    Gets list of executed migrations.
    */
    executed(): Promise<string[]>;
}
export declare function isUmzugStorage(arg: any): arg is UmzugStorage;
