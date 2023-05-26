import { RushConfigurationProject } from './rush'

/**
 * Configuration for all ship events inside the rush repo
 */
export type ShipGlobalConfig = {
  /**
   * Name of the rush repo
   */
  name: string

  /**
   * Optional environment name for project ship file
   */
  env?: string

  /**
   * Should unchanged projects be allowed to ship. This will cause version tags to be overwritten.
   */
  allowUnchanged?: boolean

  /**
   * Optional repo scope to apply to project tags
   */
  repoScope?: string
}

/**
 * Configuration for an project ship plugin
 */
export type ShipPluginConfig = {
  /**
   * Name of the docker plugin to execute
   */
  plugin: string

  /**
   * Optional image to inject into the plugin
   */
  image?: string

  /**
   * Optional entrypoint to use for docker run
   */
  entrypoint?: string[]

  /**
   * Command to run inside the image
   */
  commands: (string|string[])[][]

  /**
   * A list of environment variables that should be passed through to plugin container.
   * Will overwrite any environment variables set directly in the configuration
   */
  includedVariables?: string[]

  /**
   * A list of environment variable to add to the container.
   */
  environment?: {
    key: string
    value: string
  }[]

  /**
   * A list of docker volumes that should be attached to plugin container. Relative paths on host will be resolved
   * relative to rush project root.
   */
  volumes?: {
    hostPath: string
    containerPath: string
    ifExists?: boolean
  }[]
}

/**
 * Configuration for an individual project inside the rush repo
 */
export type ShipProjectConfig = {
  /**
   * Image to place build output in
   */
  image: string

  /**
   * Dockerfile that should be used to build project image
   */
  buildType?: string

  /**
   * If set, ship command will be skipped for this project
   */
  isCheckedOut?: boolean

  /**
   * Plugins to execute against the project
   */
  plugins: ShipPluginConfig[]

  /**
   * A list of environment variables that should be passed through to plugin container.
   * Will overwrite any environment variables set directly in the configuration.
   * Will be applied to all plugins, and overwritten by any plugin settings
   */
  includedVariables?: string[]

  /**
  * A list of environment variable to add to the container.
  * Will be applied to all plugins, and overwritten by any plugin settings
  */
  environment?: {
    key: string
    value: string
  }[]

  /**
  * A list of docker volumes that should be attached to plugin container. Relative paths on host will be resolved
  * relative to rush project root.
  * Will be applied to all plugins, and overwritten by any plugin settings
  */
  volumes?: {
    hostPath: string
    containerPath: string
    ifExists?: boolean
  }[]
}

/**
 * Service for parsing and validating ship configuration files
 */
export interface ShipConfigServiceContract {
  /**
   * Get the global ship configuration for the rush repo
   * @returns
   */
  getGlobalConfig (): Promise<ShipGlobalConfig>

  /**
   * Gets the ship configuration of a project within the rush repo
   * @param project - Project to get configuration for
   * @returns
   */
   getProjectConfig (project: RushConfigurationProject, env?: string): Promise<ShipProjectConfig>
}
