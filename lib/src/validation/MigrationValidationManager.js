"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pMap = require("p-map");
class MigrationValidationManager {
    constructor(beforeExecuteValidations) {
        this.beforeExecuteValidations = beforeExecuteValidations || [];
    }
    registerBeforeExecuteValidation(validation) {
        this.beforeExecuteValidations.push(validation);
    }
    async validateBeforeExecute(migration) {
        return pMap(this.beforeExecuteValidations, async (validation) => await validation.validate(migration));
    }
}
exports.MigrationValidationManager = MigrationValidationManager;
//# sourceMappingURL=MigrationValidationManager.js.map