"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jetpack = require("fs-jetpack");
class JSONStorage {
    constructor(options) {
        var _a;
        this.path = (_a = options === null || options === void 0 ? void 0 : options.path) !== null && _a !== void 0 ? _a : jetpack.path(process.cwd(), 'umzug.json');
    }
    async logMigration(migrationProperties) {
        const migrationName = migrationProperties.file;
        const loggedMigrations = await this.executed();
        loggedMigrations.push(migrationName);
        await jetpack.writeAsync(this.path, JSON.stringify(loggedMigrations, null, 2));
    }
    async unlogMigration(migrationProperties) {
        const migrationName = migrationProperties.file;
        const loggedMigrations = await this.executed();
        const updatedMigrations = loggedMigrations.filter(name => name !== migrationName);
        await jetpack.writeAsync(this.path, JSON.stringify(updatedMigrations, null, 2));
    }
    async executed() {
        const content = await jetpack.readAsync(this.path);
        return content ? JSON.parse(content) : [];
    }
}
exports.JSONStorage = JSONStorage;
//# sourceMappingURL=JSONStorage.js.map