"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const migration_1 = require("./migration");
const path = require("path");
const events_1 = require("events");
const pMap = require("p-map");
const pEachSeries = require("p-each-series");
const tory_1 = require("tory");
const NoneStorage_1 = require("./storages/NoneStorage");
const JSONStorage_1 = require("./storages/JSONStorage");
const MongoDBStorage_1 = require("./storages/MongoDBStorage");
const SequelizeStorage_1 = require("./storages/SequelizeStorage");
const umzug_storage_1 = require("./storages/type-helpers/umzug-storage");
const ChecksumStorage_1 = require("./storages/ChecksumStorage");
const MigrationValidationManager_1 = require("./validation/MigrationValidationManager");
class Umzug extends events_1.EventEmitter {
    // #region Constructor
    constructor(options) {
        var _a, _b, _c;
        super();
        options = options !== null && options !== void 0 ? options : {};
        if (options.logging && typeof options.logging !== 'function') {
            throw new Error('The logging-option should be either a function or false');
        }
        let migrations;
        if (Array.isArray(options.migrations)) {
            migrations = options.migrations;
        }
        else {
            migrations = {
                params: [],
                path: path.resolve(process.cwd(), 'migrations'),
                pattern: /^\d+[\w-]+\.js$/,
                traverseDirectories: false,
                wrap: (fn) => fn,
                ...options.migrations
            };
        }
        this.options = {
            storage: (_a = options.storage) !== null && _a !== void 0 ? _a : 'json',
            storageOptions: (_b = options.storageOptions) !== null && _b !== void 0 ? _b : {},
            logging: (_c = options.logging) !== null && _c !== void 0 ? _c : false,
            migrations
        };
        this.migrationValidationManager = new MigrationValidationManager_1.MigrationValidationManager();
        this.storage = Umzug.resolveStorageOption(this.options.storage, {
            migrationValidationManager: this.migrationValidationManager,
            ...this.options.storageOptions
        });
    }
    /**
    Try to require and initialize storage.
    */
    static resolveStorageOption(storage, storageOptions) {
        if (umzug_storage_1.isUmzugStorage(storage)) {
            return storage;
        }
        if (typeof storage !== 'string') {
            // TODO
            // throw new Error('Unexpected options.storage type.');
            return storage;
        }
        if (storage === 'none') {
            return new NoneStorage_1.NoneStorage();
        }
        if (storage === 'json') {
            return new JSONStorage_1.JSONStorage(storageOptions);
        }
        if (storage === 'mongodb') {
            return new MongoDBStorage_1.MongoDBStorage(storageOptions);
        }
        if (storage === 'sequelize') {
            return new SequelizeStorage_1.SequelizeStorage(storageOptions);
        }
        if (storage === 'checksum') {
            return new ChecksumStorage_1.ChecksumStorage(storageOptions);
        }
        let StorageClass;
        try {
            StorageClass = require(storage);
        }
        catch (error) {
            const errorDescription = `${error}`; // eslint-disable-line @typescript-eslint/restrict-template-expressions
            const error2 = new Error(`Unable to resolve the storage: ${storage}, ${errorDescription}`);
            error2.parent = error;
            throw error2;
        }
        const storageInstance = new StorageClass(storageOptions);
        /*
        // TODO uncomment this
        if (!isUmzugStorage(storageInstance)) {
            throw new Error(`Invalid custom storage instance obtained from \`new require('${storage}')\``);
        }

        return storageInstance;
        */
        return storageInstance;
    }
    // #endregion
    // #region EventEmitter explicit implementation typings
    on(eventName, cb) {
        return super.on(eventName, cb);
    }
    addListener(eventName, cb) {
        return super.addListener(eventName, cb);
    }
    removeListener(eventName, cb) {
        return super.removeListener(eventName, cb);
    }
    // #endregion
    /**
    Executes given migrations with a given method.
    */
    async execute(options) {
        var _a, _b;
        const method = (_a = options.method) !== null && _a !== void 0 ? _a : 'up';
        const migrations = await pMap((_b = options.migrations) !== null && _b !== void 0 ? _b : [], async (name) => this._findMigration(name));
        await pEachSeries(migrations, async (migration) => {
            const name = path.basename(migration.file, path.extname(migration.file));
            let startTime;
            const { executed, checks } = await this._beforeExecute(migration);
            if (checks && checks.length > 0)
                this.log(`Pass all checks: ${checks}`);
            if (!executed || method === 'down') {
                let { params } = this.options.migrations;
                if (typeof params === 'function') {
                    params = params();
                }
                params = params || [];
                if (method === 'up') {
                    this.log('== ' + name + ': migrating =======');
                    this.emit('migrating', name, migration);
                }
                else {
                    this.log('== ' + name + ': reverting =======');
                    this.emit('reverting', name, migration);
                }
                startTime = new Date();
                if (migration[method]) {
                    await migration[method](...params);
                }
            }
            if (!executed && (method === 'up')) {
                await this.storage.logMigration(migration);
            }
            else if (method === 'down') {
                await this.storage.unlogMigration(migration);
            }
            // TODO uncomment this
            // if (startTime === undefined) {
            // 	throw new Error('Why is a duration of NaN acceptable??');
            // }
            const duration = ((new Date() - startTime) / 1000).toFixed(3);
            if (method === 'up') {
                this.log(`== ${name}: migrated (${duration}s)\n`);
                this.emit('migrated', name, migration);
            }
            else {
                this.log(`== ${name}: reverted (${duration}s)\n`);
                this.emit('reverted', name, migration);
            }
        });
        return migrations;
    }
    /**
    Lists executed migrations.
    */
    async executed() {
        // TODO remove this forced type-cast
        return pMap((await this.storage.executed()), file => new migration_1.Migration(file, this.options));
    }
    /**
    Lists pending migrations.
    */
    async pending() {
        const all = await this._findMigrations();
        const executed = await this.executed();
        const executedFiles = executed.map(migration => migration.file);
        return all.filter(migration => !executedFiles.includes(migration.file));
    }
    /**
     Lists all migrations.
     */
    async all() {
        return await this._findMigrations();
    }
    async up(options) {
        return this._run('up', options, this.all.bind(this));
    }
    async down(options) {
        const getReversedExecuted = async () => {
            return (await this.executed()).reverse();
        };
        if (!options || Object.keys(options).length === 0) {
            const migrations = await getReversedExecuted();
            if (migrations[0]) {
                return this.down(migrations[0].file);
            }
            return [];
        }
        return this._run('down', options, getReversedExecuted);
    }
    /**
    Pass message to logger if logging is enabled.
    */
    log(message) {
        if (this.options.logging) {
            this.options.logging(message);
        }
    }
    async _run(method, options, rest) {
        if (typeof options === 'string') {
            return this._run(method, [options]);
        }
        if (Array.isArray(options)) {
            const migrationNames = options;
            const migrations = await pMap(migrationNames, async (m) => this._findMigration(m));
            if (method === 'up') {
                await this._assertPending(migrations);
            }
            else {
                await this._assertExecuted(migrations);
            }
            return this._run(method, { migrations: options });
        }
        if (options === null || options === void 0 ? void 0 : options.migrations) {
            return this.execute({
                migrations: options.migrations,
                method
            });
        }
        let migrationList = await rest();
        if (options === null || options === void 0 ? void 0 : options.to) {
            const migration = await this._findMigration(options.to);
            if (method === 'up') {
                await this._assertPending(migration);
            }
            else {
                await this._assertExecuted(migration);
            }
        }
        if (options === null || options === void 0 ? void 0 : options.from) {
            migrationList = await this._findMigrationsFromMatch(options.from, method);
        }
        const migrationFiles = await this._findMigrationsUntilMatch(options === null || options === void 0 ? void 0 : options.to, migrationList);
        return this._run(method, { migrations: migrationFiles });
    }
    /**
    Lists pending/executed migrations depending on method from a given migration (excluding itself).
    */
    async _findMigrationsFromMatch(from, method) {
        // We'll fetch all migrations and work our way from start to finish
        let migrations = await this._findMigrations();
        let found = false;
        migrations = migrations.filter(migration => {
            if (migration.testFileName(from)) {
                found = true;
                return false;
            }
            return found;
        });
        const filteredMigrations = [];
        for (const migration of migrations) {
            // Now check if they need to be run based on status and method
            // eslint-disable-next-line no-await-in-loop
            if (await this._checkExecuted(migration)) {
                if (method !== 'up') {
                    filteredMigrations.push(migration);
                }
            }
            else if (method === 'up') {
                filteredMigrations.push(migration);
            }
        }
        return filteredMigrations;
    }
    /**
    Loads all migrations in ascending order.
    */
    async _findMigrations() {
        if (Array.isArray(this.options.migrations)) {
            return this.options.migrations;
        }
        const migrationOptions = this.options.migrations;
        const migrationsFolder = new tory_1.ToryFolder(migrationOptions.path);
        const migrationsFileIterable = migrationOptions.traverseDirectories ?
            migrationsFolder.toDFSFilesRecursiveIterable() :
            migrationsFolder.getFiles();
        const migrationFiles = [...migrationsFileIterable].filter(file => {
            return migrationOptions.pattern.test(file.name);
        });
        const migrations = migrationFiles.map(file => new migration_1.Migration(file.absolutePath, this.options));
        migrations.sort((a, b) => {
            if (a.file > b.file) {
                return 1;
            }
            if (a.file < b.file) {
                return -1;
            }
            return 0;
        });
        return migrations;
    }
    /**
    Gets a migration with a given name.
    */
    async _findMigration(name) {
        const migrations = await this._findMigrations();
        const found = migrations.find(m => m.testFileName(name));
        if (found) {
            return found;
        }
        throw new Error(`Unable to find migration: ${name}`);
    }
    async _checkExecuted(arg) {
        if (Array.isArray(arg)) {
            return (await pMap(arg, async (m) => this._checkExecuted(m))).every(x => x);
        }
        const executedMigrations = await this.executed();
        const found = executedMigrations.find(m => m.testFileName(arg.file));
        return Boolean(found);
    }
    async _assertExecuted(arg) {
        if (Array.isArray(arg)) {
            await pMap(arg, async (m) => this._assertExecuted(m));
            return;
        }
        const executedMigrations = await this.executed();
        const found = executedMigrations.find(m => m.testFileName(arg.file));
        if (!found) {
            throw new Error(`Migration was not executed: ${arg.file}`);
        }
    }
    async _checkPending(arg) {
        if (Array.isArray(arg)) {
            return (await pMap(arg, async (m) => this._checkPending(m))).every(x => x);
        }
        const pendingMigrations = await this.pending();
        const found = pendingMigrations.find(m => m.testFileName(arg.file));
        return Boolean(found);
    }
    async _assertPending(arg) {
        if (Array.isArray(arg)) {
            await pMap(arg, async (m) => this._assertPending(m));
            return;
        }
        const pendingMigrations = await this.pending();
        const found = pendingMigrations.find(m => m.testFileName(arg.file));
        if (!found) {
            throw new Error(`Migration is not pending: ${arg.file}`);
        }
    }
    async _beforeExecute(migration) {
        const executed = await this._checkExecuted(migration);
        const migrationValidationResults = await this.migrationValidationManager.validateBeforeExecute(migration);
        if (migrationValidationResults.every(v => v.isValid)) {
            return {
                executed: executed,
                checks: migrationValidationResults.map(v => v.name)
            };
        }
        else {
            const failedValidationMessage = migrationValidationResults
                .filter(v => !v.isValid)
                .map(v => v.validationError);
            throw new Error(`Migration validation failure. Errors: ${failedValidationMessage}`);
        }
    }
    /**
    Skip migrations in a given migration list after `to` migration.
    */
    async _findMigrationsUntilMatch(to, migrations) {
        if (!Array.isArray(migrations)) {
            migrations = [migrations];
        }
        const files = migrations.map(migration => migration.file);
        if (!to) {
            return files;
        }
        const result = [];
        for (const file of files) {
            result.push(file);
            if (file.startsWith(to)) {
                break;
            }
        }
        return result;
    }
}
exports.Umzug = Umzug;
//# sourceMappingURL=umzug.js.map