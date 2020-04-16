import { UmzugStorage } from './type-helpers/umzug-storage';
import { MigrationProperties } from "../migration";
declare type AnyObject = {
    [key: string]: any;
};
export interface MongoDBConnectionOptions {
    /**
    A connection to target database established with MongoDB Driver
    */
    readonly connection: AnyObject;
    /**
    The name of the migration collection in MongoDB

    @default 'migrations'
    */
    readonly collectionName?: string;
}
export interface MongoDBCollectionOptions {
    /**
    A reference to a MongoDB Driver collection
    */
    readonly collection: AnyObject;
}
export declare type MongoDBStorageConstructorOptions = MongoDBConnectionOptions | MongoDBCollectionOptions;
export declare class MongoDBStorage implements UmzugStorage {
    readonly collection: AnyObject;
    readonly connection: any;
    readonly collectionName: string;
    constructor(options: MongoDBStorageConstructorOptions);
    logMigration(migrationProperties: MigrationProperties): Promise<void>;
    unlogMigration(migrationProperties: MigrationProperties): Promise<void>;
    executed(): Promise<string[]>;
}
export {};
