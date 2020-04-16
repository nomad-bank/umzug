import { UmzugStorage } from './type-helpers/umzug-storage';
import { MigrationProperties } from "../migration";
export declare class NoneStorage implements UmzugStorage {
    logMigration(_migrationProperties: MigrationProperties): Promise<void>;
    unlogMigration(_migrationProperties: MigrationProperties): Promise<void>;
    executed(): Promise<string[]>;
}
