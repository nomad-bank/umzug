import { Migration } from "../../migration";

export interface MigrationValidationResult {
  name: string;
  isValid: boolean;
  validationError?: string;
}

export interface MigrationValidation {
  validate(migration: Migration): Promise<MigrationValidationResult>;
}
