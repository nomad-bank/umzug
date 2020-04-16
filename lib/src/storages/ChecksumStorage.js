"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const ChecksumValidation_1 = require("../validation/ChecksumValidation");
class ChecksumStorage {
    constructor(options) {
        var _a;
        if (!options || !options.sequelize) {
            throw new Error('"sequelize" storage option is required');
        }
        options.migrationValidationManager.registerBeforeExecuteValidation(new ChecksumValidation_1.ChecksumValidation(this));
        this.sequelize = options.sequelize;
        const tableName = (_a = options.tableName) !== null && _a !== void 0 ? _a : 'migrations';
        const schema = options.schema;
        this.model = this.sequelize.define('migrations', {
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: true,
                primaryKey: true,
                autoIncrement: false
            },
            checksum: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            }
        }, {
            tableName: tableName,
            schema: schema,
            updatedAt: false
        });
    }
    async executed() {
        await this.model.sync();
        const migrations = await this.model.findAll({ order: [['name', 'ASC']] });
        return migrations.map(migration => {
            const name = migration['name'];
            if (typeof name !== 'string') {
                throw new TypeError(`Unexpected migration name type: expected string, got ${typeof name}`);
            }
            return name;
        });
    }
    async logMigration(migrationProperties) {
        const migrationName = migrationProperties.file;
        await this.model.sync();
        await this.model.create({
            name: migrationName,
            checksum: migrationProperties.checksum
        });
    }
    async unlogMigration(migrationProperties) {
        const migrationName = migrationProperties.file;
        await this.model.sync();
        await this.model.destroy({
            where: {
                name: migrationName
            }
        });
    }
    async getChecksum(migrationProperties) {
        const migrationName = migrationProperties.file;
        await this.model.sync();
        const migration = await this.model.findOne({ where: { name: migrationName } });
        return migration === null || migration === void 0 ? void 0 : migration.checksum;
    }
}
exports.ChecksumStorage = ChecksumStorage;
//# sourceMappingURL=ChecksumStorage.js.map