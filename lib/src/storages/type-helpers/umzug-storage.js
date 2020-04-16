"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isUmzugStorage(arg) {
    return arg && typeof arg.logMigration === 'function' && typeof arg.unlogMigration === 'function' && typeof arg.executed === 'function';
}
exports.isUmzugStorage = isUmzugStorage;
//# sourceMappingURL=umzug-storage.js.map