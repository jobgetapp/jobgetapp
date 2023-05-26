import * as NodeFS from 'fs'
import * as NodePath from 'path'

import { Contracts } from '@jobgetapp/ship-plugin'
import { ITerminal, LockFile } from '@rushstack/node-core-library'

import {
  ImageServiceContract,
  ProjectTagServiceContract,
  PluginExecutorServiceContract
} from '~/contracts'

/**
 * Service for executing project plugins
 */
export class PluginExecutorService implements PluginExecutorServiceContract {
  /**
   * Create new PluginExecutorService
   * @param rushConfiguration -
   * @param terminal -
   * @param lockFile -
   * @param projectTagService -
   * @param pathService -
   * @param imageService -
   * @param dockerService -
   * @param configService -
   * @param processEnv -
   * @param fs -
   * @param path -
   */
  public constructor (
    protected readonly rushConfiguration: Contracts.RushConfiguration,
    protected readonly terminal: ITerminal,
    protected readonly lockFile: typeof LockFile,
    protected readonly projectTagService: ProjectTagServiceContract,
    protected readonly pathService: Contracts.ShipPathServiceContract,
    protected readonly imageService: ImageServiceContract,
    protected readonly dockerService: Contracts.Docker.DockerServiceContract,
    protected readonly configService: Contracts.ShipConfigServiceContract,
    protected readonly config: Contracts.ShipGlobalConfig,
    protected readonly processEnv: NodeJS.ProcessEnv,
    protected readonly fs: typeof NodeFS,
    protected readonly path: typeof NodePath
  ) {}

  /**
   * Create environment variables to inject into docker run command
   * @param pluginOptions -
   * @param tag -
   * @returns
   */
  protected collectEnvironmentVariables (
    project: Contracts.RushConfigurationProject,
    pluginOptions: Contracts.ShipPluginConfig,
    tag: string
  ): Record<string, string> {
    const env: Record<string, string> = {}

    // Set direct environment variables
    const environment = pluginOptions.environment || []
    for (const variable of environment) {
      env[variable.key] = variable.value
    }

    // Pass through environment variables from host
    const includeVariables = pluginOptions.includedVariables || []
    for (const variable of includeVariables) {
      const value = this.processEnv[variable]
      if (value) {
        env[variable] = value
      }
    }

    // Ensure the project image is provided as an environment variable
    env.PROJECT_IMAGE = tag
    env.PROJECT_NAME = project.packageName
    env.PROJECT_UNSCOPED_NAME = project.unscopedTempProjectName
    return env
  }

  /**
   * Resolve path to content on host from relative paths
   * (This is required as docker needs absolute paths)
   * @param hostPath -
   * @returns
   */
  protected resolveHostVolumePath (
    hostPath: string
  ): string {
    if (hostPath.startsWith('~/')) {
      // Resolve paths relative to current users home directory
      return this.path.resolve(this.processEnv.HOME || '/', hostPath.slice(2))
    } else if (hostPath.startsWith('./')) {
      // Resolve paths relative to rush repo
      return this.path.resolve(this.rushConfiguration.rushJsonFolder, hostPath)
    } else {
      return hostPath
    }
  }

  /**
   * Collect volumes to attach when running docker command
   * @param pluginOptions -
   * @returns
   */
  protected collectVolumes (
    pluginOptions: Contracts.ShipPluginConfig
  ): Record<string, string> {
    const volumes: Record<string, string> = {}

    const includedVolumes = pluginOptions.volumes || []
    for (const volume of includedVolumes) {
      const resolvedHostPath = this.resolveHostVolumePath(volume.hostPath)
      if (this.fs.existsSync(resolvedHostPath)) {
        // If the path for the volume exists on the host add it to the mount volumes list
        volumes[this.resolveHostVolumePath(volume.hostPath)] = volume.containerPath
      } else if (!volume.ifExists) {
        // If the path doesn't exist and the soft failure flag is not set, throw an error
        throw new Error(`Expect host path to exist for plugin volume: ${resolvedHostPath}`)
      }
    }

    // Always pass through the docker socket for docker in docker plugins
    volumes['/var/run/docker.sock'] = '/var/run/docker.sock'
    return volumes
  }

  /**
   * Inject environment variables in command
   * @param command -
   * @param environmentVariables -
   * @returns
   */
  protected injectCommandVariables (
    command: string[],
    environmentVariables: Record<string, string|number>
  ): string[] {
    return command.map(arg => {
      let injectedArg = arg
      // This is not great
      for (const key in environmentVariables) {
        injectedArg = injectedArg.replace(
          new RegExp('\\${{' + `${key}` + '}}', 'g'),
          environmentVariables[key].toString()
        )
      }
      return injectedArg
    })
  }

  /**
   * Execute an individual project plugin
   * @param project -
   * @param pluginOptions -
   * @param tag -
   */
  protected async executePlugin (
    project: Contracts.RushConfigurationProject,
    pluginOptions: Contracts.ShipPluginConfig,
    tag: string
  ): Promise<void> {
    // Get the plugin image, or build it from a base image
    const pluginImage = pluginOptions.image
      ? await this.imageService.resolveBaseImage(pluginOptions.image)
      : tag

    // Build the docker plugin for the project
    const pluginTag = `${tag}-${pluginOptions.plugin}`
    await this.dockerService.buildImage(`${this.pathService.pluginContainersFolder}/${pluginOptions.plugin}`, {
      tag: pluginTag,
      dockerFile: `${this.pathService.pluginContainersFolder}/${pluginOptions.plugin}/Dockerfile`,
      args: {
        REPO_NAME: this.config.name,
        PROJECT_IMAGE: tag,
        PLUGIN_IMAGE: pluginImage,
        PROJECT: project.packageName,
        PROJECT_PATH: project.projectRelativeFolder
      }
    })

    // Execute the command inside a plugin container
    const environment = this.collectEnvironmentVariables(project, pluginOptions, tag)
    for (const command of pluginOptions.commands) {
      const flattenedCommand = command.map(cmd => Array.isArray(cmd) ? cmd.join(' ') : cmd)
      await this.dockerService.run({
        tag: pluginTag,
        entrypoint: pluginOptions.entrypoint,
        command: this.injectCommandVariables(flattenedCommand, environment),
        environment,
        volumes: this.collectVolumes(pluginOptions)
      })
    }
  }

  /**
   * Synchronously execute each project plugin
   * @param project -
   * @param plugins -
   * @param tag -
   */
  protected async executePlugins (
    project: Contracts.RushConfigurationProject,
    projectConfig: Contracts.ShipProjectConfig,
    plugins: Contracts.ShipPluginConfig[],
    tag: string
  ): Promise<void> {
    // Execute each plugin
    for (const pluginOptions of plugins) {
      await this.executePlugin(project, {
        ...pluginOptions,
        // Merge project configuration with plugin configuration
        environment: [
          ...(projectConfig.environment || []),
          ...(pluginOptions.environment || [])
        ],
        includedVariables: [
          ...(projectConfig.includedVariables || []),
          ...(pluginOptions.includedVariables || [])
        ],
        volumes: [
          ...(projectConfig.volumes || []),
          ...(pluginOptions.volumes || [])
        ]
      }, tag)
    }
  }

  /**
   * Execute all plugins for the provided project
   * @param project - Project to execute plugins for
   */
  public async execute (
    project: Contracts.RushConfigurationProject,
    tag?: string
  ): Promise<void> {
    // Create lock file when running project plugins
    const shipLockFile = this.lockFile.tryAcquire(project.projectRushTempFolder, project.unscopedTempProjectName)
    if (!shipLockFile) {
      throw new Error(`
        Unable to acquire lockfile for project: ${project.packageName}.
        Ensure ship task is not already running, or verify write access to:
        ${this.lockFile.getLockFilePath(project.projectRushTempFolder, project.unscopedTempProjectName)}
      `)
    }

    // Extract project info
    const projectTag = tag || await this.projectTagService.getProjectTag(project)
    const config = await this.configService.getProjectConfig(project, this.config.env)

    // Ensure plugins exist
    if (config.plugins.length === 0) {
      throw new Error(`No ship plugins defined for project: ${project.packageName}`)
    }

    // Execute plugins and release lock file
    await this.executePlugins(project, config, config.plugins, projectTag)
      .finally(() => shipLockFile.release())
  }
}
