import { JsonFile, JsonSchema } from '@rushstack/node-core-library'

import {
  ShipGlobalConfig,
  ShipProjectConfig,
  ShipConfigSchemaName,
  ShipPathServiceContract,
  RushConfigurationProject,
  ShipSchemaServiceContract,
  ShipConfigServiceContract
} from '~/contracts'

/**
 * Service for parsing and validating ship configuration files
 */
export class ShipConfigService implements ShipConfigServiceContract {
  protected readonly configSchema: JsonSchema
  protected readonly projectConfigSchema: JsonSchema

  /**
   * Create new ShipConfigService
   * @param jsonFile - Service for parsing JSON files
   * @param pathService - Service for locating ship configuration files
   * @param schemaService - Service for validating ship configuration files
   */
  public constructor (
    protected readonly jsonFile: typeof JsonFile,
    protected readonly pathService: ShipPathServiceContract,
    protected readonly schemaService: ShipSchemaServiceContract
  ) {
    this.configSchema = this.schemaService.getJsonSchema(ShipConfigSchemaName.config)
    this.projectConfigSchema = this.schemaService.getJsonSchema(ShipConfigSchemaName.project)
  }

  /**
   * Determines if an environment variable string value is truthy
   * @param value -
   * @returns
   */
  protected isTruthyString (value?: string): boolean {
    if (!value) {
      return false
    }

    return value.toLowerCase() === 'true' || value.toLowerCase() === 't' || parseInt(value) === 1
  }

  /**
   * Get the global ship configuration for the rush repo
   * @returns
   */
  public async getGlobalConfig (): Promise<ShipGlobalConfig> {
    const config = await this.jsonFile
      .loadAndValidateAsync(this.pathService.configFile, this.configSchema)

    return {
      ...config,
      env: process.env.SHIP_ENV,
      repoScope: process.env.REPO_SCOPE,
      allowUnchanged: this.isTruthyString(process.env.ALLOW_UNCHANGED)
    }
  }

  /**
   * Gets the ship configuration of a project within the rush repo
   * @param project - Project to get configuration for
   * @returns
   */
  public getProjectConfig (project: RushConfigurationProject, env?: string): Promise<ShipProjectConfig> {
    return this.jsonFile
      .loadAndValidateAsync(this.pathService.getProjectConfigFile(project, env), this.projectConfigSchema)
  }
}
