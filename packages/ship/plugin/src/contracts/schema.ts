import { JsonSchema } from '@rushstack/node-core-library'

/**
 * Available ship configuration file schemas
 */
export enum ShipConfigSchemaName {
  config = 'config',
  project = 'project'
}

/**
 * Service for obtaining ship configuration file schemas
 */
export interface ShipSchemaServiceContract {
  /**
   * Get the JSON schema for the selected ship configuration schema type
   * @param schemaName - Name of schema to get
   */
  getJsonSchema (
    schemaName: ShipConfigSchemaName
  ): JsonSchema
}
