"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A simple helper to build a list of migrations that is suitable according to
 * Umzug's format.
 *
 * @param {Array} migrations A list of migration. Each one must contain 'up', 'down' and 'name'.
 * @param {Array} parameters A facultative list of parameters that will be given to the 'up' and 'down' functions.
 * @returns {Array} The migrations in Umzug's format
 */
function migrationsList(migrations, parameters = []) {
    const pseudoMigrations = migrations.map(({ up, down, name }) => {
        return {
            file: name,
            testFileName(needle) {
                return name.startsWith(needle);
            },
            up,
            down
        };
    });
    /// TODO remove type-cast hack, make pseudoMigrations real migrations
    const migrationOptions = pseudoMigrations;
    migrationOptions.params = parameters;
    return migrationOptions;
}
exports.migrationsList = migrationsList;
//# sourceMappingURL=migrationsList.js.map