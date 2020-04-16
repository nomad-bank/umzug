"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const umzug_1 = require("./umzug");
var umzug_2 = require("./umzug");
exports.Umzug = umzug_2.Umzug;
const migration_1 = require("./migration");
var migration_2 = require("./migration");
exports.Migration = migration_2.Migration;
const migrationsList_1 = require("./migrationsList");
var migrationsList_2 = require("./migrationsList");
exports.migrationsList = migrationsList_2.migrationsList;
exports.default = { Migration: migration_1.Migration, migrationsList: migrationsList_1.migrationsList, Umzug: umzug_1.Umzug };
// For CommonJS default export support
module.exports = { Migration: migration_1.Migration, migrationsList: migrationsList_1.migrationsList, Umzug: umzug_1.Umzug };
module.exports.default = { Migration: migration_1.Migration, migrationsList: migrationsList_1.migrationsList, Umzug: umzug_1.Umzug };
// TODO remove all eslint-disable comments around the code
//# sourceMappingURL=index.js.map