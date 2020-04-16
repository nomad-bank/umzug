"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isMongoDBCollectionOptions(arg) {
    return Boolean(arg === null || arg === void 0 ? void 0 : arg.collection);
}
class MongoDBStorage {
    constructor(options) {
        var _a, _b;
        if (!options || (!options.collection && !options.connection)) {
            throw new Error('MongoDB Connection or Collection required');
        }
        if (isMongoDBCollectionOptions(options)) {
            this.collection = options.collection;
        }
        else {
            this.collection = options.connection.collection((_a = options.collectionName) !== null && _a !== void 0 ? _a : 'migrations');
        }
        this.connection = options.connection; // TODO remove this
        this.collectionName = (_b = options.collectionName) !== null && _b !== void 0 ? _b : 'migrations'; // TODO remove this
    }
    async logMigration(migrationProperties) {
        const migrationName = migrationProperties.file;
        await this.collection.insertOne({ migrationName });
    }
    async unlogMigration(migrationProperties) {
        const migrationName = migrationProperties.file;
        await this.collection.removeOne({ migrationName });
    }
    async executed() {
        const records = await this.collection.find({}).sort({ migrationName: 1 }).toArray();
        return records.map(r => r.migrationName);
    }
}
exports.MongoDBStorage = MongoDBStorage;
//# sourceMappingURL=MongoDBStorage.js.map