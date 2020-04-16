import { MigrationDefinition, ShortMigrationOptions } from './types';
export interface MigrationConstructorOptions {
    readonly migrations?: ShortMigrationOptions;
}
export declare type MigrationProperties = Readonly<Pick<Migration, 'file' | 'path' | 'checksum'>>;
export declare class Migration {
    readonly path: string;
    private readonly options?;
    readonly file: string;
    constructor(path: string, options?: MigrationConstructorOptions);
    /**
    Obtain the migration definition module, using a custom resolver if present.
    */
    migration(): Promise<MigrationDefinition>;
    /**
    Executes method `up` of the migration.
    */
    up(...args: readonly any[]): Promise<void>;
    /**
    Executes method `down` of the migration.
    */
    down(...args: readonly any[]): Promise<void>;
    /**
    Check if migration file name starts with the given string.
    */
    testFileName(string: string): boolean;
    /**
    Get migration file checksum
     */
    get checksum(): string;
    /**
    Executes a given method of migration with given arguments.
    */
    private _exec;
}
