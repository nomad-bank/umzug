import { ModelClassType, SequelizeType } from "./type-helpers/sequelize-type-helpers";
import { UmzugStorage } from "./type-helpers/umzug-storage";
import { MigrationProperties } from "../migration";
import { DataTypes } from "sequelize";
import { MigrationValidationManager } from "../validation/MigrationValidationManager";
import { ChecksumValidation } from "../validation/ChecksumValidation";

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

export class ChecksumStorage implements UmzugStorage {

  private readonly sequelize: SequelizeType;
  private readonly model: ModelClassType;

  constructor(options: ChecksumStorageConstructorOptions) {
    if (!options || !options.sequelize) {
      throw new Error('"sequelize" storage option is required');
    }

    options.migrationValidationManager.registerBeforeExecuteValidation(
      new ChecksumValidation(this)
    );

    this.sequelize = options.sequelize;

    const tableName = options.tableName ?? 'migrations';
    const schema = options.schema;

    this.model = this.sequelize.define(
      'migrations',
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          primaryKey: true,
          autoIncrement: false
        },
        checksum: {
          type: DataTypes.STRING,
          allowNull: false
        }
      },
      {
        tableName: tableName,
        schema: schema,
        updatedAt: false
      }
    ) as ModelClassType;
  }

  async executed(): Promise<string[]> {
    await this.model.sync();
    const migrations: any[] = await this.model.findAll({ order: [['name', 'ASC']] });
    return migrations.map(migration => {
      const name = migration['name'];
      if (typeof name !== 'string') {
        throw new TypeError(`Unexpected migration name type: expected string, got ${typeof name}`);
      }

      return name;
    });
  }

  async logMigration(migrationProperties: MigrationProperties): Promise<void> {
    const migrationName = migrationProperties.file;
    await this.model.sync();
    await this.model.create({
      name: migrationName,
      checksum: migrationProperties.checksum
    });
  }

  async unlogMigration(migrationProperties: MigrationProperties): Promise<void> {
    const migrationName = migrationProperties.file;
    await this.model.sync();
    await this.model.destroy({
      where: {
        name: migrationName
      }
    });
  }

  async getChecksum(migrationProperties: MigrationProperties): Promise<string> {
    const migrationName = migrationProperties.file;
    await this.model.sync();
    const migration = await this.model.findOne({where: {name: migrationName}});
    return migration?.checksum;
  }

}
