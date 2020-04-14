import { Migration } from "../migration";
import { MigrationValidation, MigrationValidationResult } from "./type-helpers/MigrationValidation";
import pMap = require("p-map");

export class MigrationValidationManager {

  private readonly beforeExecuteValidations: Array<MigrationValidation>;

  constructor(beforeExecuteValidations?: Array<MigrationValidation>) {
    this.beforeExecuteValidations = beforeExecuteValidations || [];
  }

  public registerBeforeExecuteValidation(validation: MigrationValidation): void {
    this.beforeExecuteValidations.push(validation);
  }

  public async validateBeforeExecute(migration: Migration): Promise<Array<MigrationValidationResult>> {
    return pMap(
      this.beforeExecuteValidations,
      async validation => await validation.validate(migration)
    );
  }

}
