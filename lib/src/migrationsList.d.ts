import { MigrationDefinition, UmzugConstructorMigrationOptionsB } from './types';
export interface MigrationDefinitionWithName extends MigrationDefinition {
    name: string;
}
/**
 * A simple helper to build a list of migrations that is suitable according to
 * Umzug's format.
 *
 * @param {Array} migrations A list of migration. Each one must contain 'up', 'down' and 'name'.
 * @param {Array} parameters A facultative list of parameters that will be given to the 'up' and 'down' functions.
 * @returns {Array} The migrations in Umzug's format
 */
export declare function migrationsList(migrations: MigrationDefinitionWithName[], parameters?: any[]): UmzugConstructorMigrationOptionsB;
