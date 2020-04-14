import { UmzugStorage } from './type-helpers/umzug-storage';
import { MigrationProperties } from "../migration";

export class NoneStorage implements UmzugStorage {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	async logMigration(_migrationProperties: MigrationProperties): Promise<void> {}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	async unlogMigration(_migrationProperties: MigrationProperties): Promise<void> {}

	async executed(): Promise<string[]> {
		return [];
	}
}
