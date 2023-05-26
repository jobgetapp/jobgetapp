import * as path from 'path'

import { JsonSchema } from '@rushstack/node-core-library'

import { ShipConfigSchemaName, ShipSchemaServiceContract } from '~/contracts'

/**
 * Service for obtaining ship configuration file schemas
 */
export class ShipSchemaService implements ShipSchemaServiceContract {
  /**
   * Create new SchemaService
   * @param jsonSchema - Service for parsing JSON schema data
   */
  public constructor (
    protected readonly jsonSchema: typeof JsonSchema
  ) {}

  /**
   * Get the JSON schema for the selected ship configuration schema type
   * @param schemaName - Name of schema to get
   */
  public getJsonSchema (
    schemaName: ShipConfigSchemaName
  ): JsonSchema {
    const schemaPath = path.join(__dirname, `../../schemas/${schemaName}.schema.json`)
    return this.jsonSchema.fromFile(schemaPath)
  }
}
