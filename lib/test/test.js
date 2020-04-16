"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const jetpack = require("fs-jetpack");
const src_1 = require("../src");
const pkgDir = require("pkg-dir");
ava_1.default('Compiles & exports correctly', async (t) => {
    const dir = await pkgDir(__dirname);
    let requiredJS;
    t.notThrows(() => {
        requiredJS = require(dir);
    });
    t.truthy(requiredJS.Umzug);
    t.truthy(requiredJS.Migration);
    t.truthy(requiredJS.migrationsList);
});
ava_1.default('migrationsList() works', async (t) => {
    const executed = [];
    await jetpack.removeAsync('umzug.json');
    const umzug = new src_1.Umzug({
        migrations: src_1.migrationsList([
            {
                name: '00-first-migration',
                async up() {
                    executed.push('00-first-migration-up');
                },
                async down() {
                    executed.push('00-first-migration-down');
                }
            },
            {
                name: '01-second-migration',
                async up() {
                    executed.push('01-second-migration-up');
                },
                async down() {
                    executed.push('01-second-migration-down');
                }
            }
        ])
    });
    const names = (migrations) => migrations.map(m => m.file);
    // Before anything
    t.deepEqual(executed, []);
    t.deepEqual(names(await umzug.executed()), []);
    t.deepEqual(names(await umzug.pending()), ['00-first-migration', '01-second-migration']);
    // Up: all at once
    t.deepEqual(names(await umzug.up()), ['00-first-migration', '01-second-migration']);
    t.deepEqual(executed, ['00-first-migration-up', '01-second-migration-up']);
    t.deepEqual(names(await umzug.executed()), ['00-first-migration', '01-second-migration']);
    t.deepEqual(names(await umzug.pending()), []);
    // Down: one by one
    t.deepEqual(names(await umzug.down()), ['01-second-migration']);
    t.deepEqual(executed, ['00-first-migration-up', '01-second-migration-up', '01-second-migration-down']);
    t.deepEqual(names(await umzug.executed()), ['00-first-migration']);
    t.deepEqual(names(await umzug.pending()), ['01-second-migration']);
    t.deepEqual(names(await umzug.down()), ['00-first-migration']);
    t.deepEqual(executed, ['00-first-migration-up', '01-second-migration-up', '01-second-migration-down', '00-first-migration-down']);
    t.deepEqual(names(await umzug.executed()), []);
    t.deepEqual(names(await umzug.pending()), ['00-first-migration', '01-second-migration']);
    await jetpack.removeAsync('umzug.json');
});
//# sourceMappingURL=test.js.map