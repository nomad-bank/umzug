/// <reference types="node" />
import { Migration } from './migration';
import { EventEmitter } from 'events';
import { UmzugStorage } from './storages/type-helpers/umzug-storage';
import { UmzugExecuteOptions, UmzugConstructorOptions, UmzugEventNames } from './types';
export declare class Umzug extends EventEmitter {
    private readonly migrationValidationManager;
    readonly options: Required<UmzugConstructorOptions>;
    storage: UmzugStorage;
    constructor(options?: UmzugConstructorOptions);
    /**
    Try to require and initialize storage.
    */
    private static resolveStorageOption;
    on(eventName: UmzugEventNames, cb?: (name: string, migration: Migration) => void): this;
    addListener(eventName: UmzugEventNames, cb?: (name: string, migration: Migration) => void): this;
    removeListener(eventName: UmzugEventNames, cb?: (name: string, migration: Migration) => void): this;
    /**
    Executes given migrations with a given method.
    */
    execute(options?: UmzugExecuteOptions): Promise<Migration[]>;
    /**
    Lists executed migrations.
    */
    executed(): Promise<Migration[]>;
    /**
    Lists pending migrations.
    */
    pending(): Promise<Migration[]>;
    /**
     Lists all migrations.
     */
    all(): Promise<Migration[]>;
    /**
    Executes the next pending migration.
    */
    up(): Promise<Migration[]>;
    /**
    Executes the given migration (by name).
    */
    up(migrationsName: string): Promise<Migration[]>;
    /**
    Executes the given migrations (by name).
    */
    up(migrationsNames: string[] | {
        migrations: string[];
    }): Promise<Migration[]>;
    /**
    Executes the migrations in the given interval. The interval excludes `from` and includes `to`.

    If `from` is omitted, takes from the beginning.
    If `to` is omitted, takes to the end.
    */
    up(options: {
        from?: string;
        to?: string;
    }): Promise<Migration[]>;
    /**
    Undoes the last executed migration.
    */
    down(): Promise<Migration[]>;
    /**
    Undoes the given migration (by name).
    */
    down(migrationsName: string): Promise<Migration[]>;
    /**
    Undoes the given migrations (by name).
    */
    down(migrationsNames: string[] | {
        migrations: string[];
    }): Promise<Migration[]>;
    /**
    Undoes the migrations in the given interval. The interval excludes `from` and includes `to`.

    If `from` is omitted, takes from the beginning.
    If `to` is omitted, takes to the end.
    */
    down(options: {
        from?: string;
        to?: string;
    }): Promise<Migration[]>;
    /**
    Pass message to logger if logging is enabled.
    */
    log(message: any): void;
    private _run;
    /**
    Lists pending/executed migrations depending on method from a given migration (excluding itself).
    */
    private _findMigrationsFromMatch;
    /**
    Loads all migrations in ascending order.
    */
    private _findMigrations;
    /**
    Gets a migration with a given name.
    */
    private _findMigration;
    private _checkExecuted;
    private _assertExecuted;
    private _checkPending;
    private _assertPending;
    private _beforeExecute;
    /**
    Skip migrations in a given migration list after `to` migration.
    */
    private _findMigrationsUntilMatch;
}
