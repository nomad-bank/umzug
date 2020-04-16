import { UmzugStorage } from './type-helpers/umzug-storage';
import { SequelizeType, ModelClassType } from './type-helpers/sequelize-type-helpers';
import { SetRequired } from 'type-fest';
import { MigrationProperties } from "../migration";
interface _SequelizeStorageConstructorOptions {
    /**
    The configured instance of Sequelize. If omitted, it is inferred from the `model` option.
    */
    readonly sequelize?: SequelizeType;
    /**
    The model representing the SequelizeMeta table. Must have a column that matches the `columnName` option. If omitted, it is created automatically.
    */
    readonly model?: any;
    /**
    The name of the model.

    @default 'SequelizeMeta'
    */
    readonly modelName?: string;
    /**
    The name of the table. If omitted, defaults to the model name.
    */
    readonly tableName?: string;
    /**
    Name of the schema under which the table is to be created.

    @default undefined
    */
    readonly schema?: any;
    /**
    Name of the table column holding the executed migration names.

    @default 'name'
    */
    readonly columnName?: string;
    /**
    The type of the column holding the executed migration names.

    For `utf8mb4` charsets under InnoDB, you may need to set this to less than 190

    @default Sequelize.DataTypes.STRING
    */
    readonly columnType?: any;
    /**
    Option to add timestamps to the table

    @default false
    */
    readonly timestamps?: boolean;
}
export declare type SequelizeStorageConstructorOptions = SetRequired<_SequelizeStorageConstructorOptions, 'sequelize'> | SetRequired<_SequelizeStorageConstructorOptions, 'model'>;
export declare class SequelizeStorage implements UmzugStorage {
    readonly sequelize: SequelizeType;
    readonly columnType: string;
    readonly columnName: string;
    readonly timestamps: boolean;
    readonly modelName: string;
    readonly tableName: string;
    readonly schema: any;
    readonly model: ModelClassType;
    /**
    Constructs Sequelize based storage. Migrations will be stored in a SequelizeMeta table using the given instance of Sequelize.

    If a model is given, it will be used directly as the model for the SequelizeMeta table. Otherwise, it will be created automatically according to the given options.

    If the table does not exist it will be created automatically upon the logging of the first migration.
    */
    constructor(options: SequelizeStorageConstructorOptions);
    getModel(): ModelClassType;
    logMigration(migrationProperties: MigrationProperties): Promise<void>;
    unlogMigration(migrationProperties: MigrationProperties): Promise<void>;
    executed(): Promise<string[]>;
    _model(): ModelClassType;
}
export {};
