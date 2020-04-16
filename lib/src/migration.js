"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _path = require("path");
const fs = require("fs");
const md5 = require("md5");
function isPromise(arg) {
    // eslint-disable-next-line promise/prefer-await-to-then
    return arg && typeof arg.then === 'function';
}
class Migration {
    constructor(path, options) {
        this.path = path;
        this.options = options;
        this.path = _path.resolve(path);
        this.options = {
            ...options,
            migrations: {
                nameFormatter: (path) => _path.basename(path),
                ...options.migrations
            }
        };
        this.file = this.options.migrations.nameFormatter(this.path);
        if (typeof this.file !== 'string') {
            throw new TypeError(`Unexpected migration formatter result for '${this.path}': expected string, got ${typeof this.file}`);
        }
    }
    /**
    Obtain the migration definition module, using a custom resolver if present.
    */
    async migration() {
        let result;
        if (typeof this.options.migrations.customResolver === 'function') {
            result = this.options.migrations.customResolver(this.path);
        }
        else {
            result = require(this.path);
        }
        if (!result) {
            throw new Error(`Failed to obtain migration definition module for '${this.path}'`);
        }
        if (!result.up && !result.down && result.default) {
            result = result.default;
        }
        return result;
    }
    /**
    Executes method `up` of the migration.
    */
    async up(...args) {
        await this._exec('up', args);
    }
    /**
    Executes method `down` of the migration.
    */
    async down(...args) {
        return this._exec('down', args);
    }
    /**
    Check if migration file name starts with the given string.
    */
    testFileName(string) {
        return this.file.startsWith(this.options.migrations.nameFormatter(string));
    }
    /**
    Get migration file checksum
     */
    get checksum() {
        return md5(fs.readFileSync(this.path));
    }
    /**
    Executes a given method of migration with given arguments.
    */
    async _exec(method, args) {
        const migration = await this.migration();
        const fn = migration[method];
        if (!fn) {
            throw new Error('Could not find migration method: ' + method);
        }
        const result = this.options.migrations.wrap(fn).apply(migration, args);
        if (!isPromise(result)) {
            throw new Error(`Migration ${this.file} (or wrapper) didn't return a promise`);
        }
        await result;
    }
}
exports.Migration = Migration;
//# sourceMappingURL=migration.js.map