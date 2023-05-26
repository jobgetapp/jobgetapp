import {
  RushConfiguration,
  ShipPathServiceContract,
  RushConfigurationProject
} from '~/contracts'

/**
 * Service for obtaining ship global file paths
 */
export class ShipPathService implements ShipPathServiceContract {
  /**
   * Create new ShipPathService
   * @param rushConfiguration - Configuration for the current rush repo
   */
  public constructor (
    protected readonly rushConfiguration: RushConfiguration
  ) {}

  /**
   * Path to ship root folder (common/config/ship)
   */
  public get rootFolder (): string {
    return `${this.rushConfiguration.commonFolder}/config/ship`
  }

  /**
   * Path to ship global configuration file (common/config/ship/config.json)
   */
  public get configFile (): string {
    return `${this.rootFolder}/config.json`
  }

  /**
   * Path to container root folder (common/config/ship/containers)
   */
  public get containersFolder (): string {
    return `${this.rootFolder}/containers`
  }

  /**
   * Path to docker build orchestration docker file (common/config/ship/containers/Dockerfile)
   */
  public get repoDockerFile (): string {
    return `${this.containersFolder}/Dockerfile`
  }

  /**
   * Path to folder containing project base images (common/config/ship/containers/base)
   */
  public get baseContainersFolder (): string {
    return `${this.containersFolder}/base`
  }

  /**
   * Path to folder containing project build images (common/config/ship/containers/build)
   */
  public get buildContainersFolder (): string {
    return `${this.containersFolder}/build`
  }

  /**
   * Path to folder containing project base images (common/config/ship/containers/plugin)
   */
  public get pluginContainersFolder (): string {
    return `${this.containersFolder}/plugin`
  }

  /**
   * Path to docker file for a specified build type (common/config/ship/containers/build/$buildType/DockerFile)
   * @param buildType - Dockerfile build type
   * @returns
   */
  public getBuildDockerFile (buildType: string): string {
    return `${this.buildContainersFolder}/${buildType}/Dockerfile`
  }

  /**
   * Get path to a projects ship configuration file ($project_root/config/ship.json)
   * @param project - Project to get configuration of
   * @returns
   */
  public getProjectConfigFile (
    project: RushConfigurationProject,
    env?: string
  ): string {
    return env
      ? `${project.projectFolder}/config/ship.${env}.json`
      : `${project.projectFolder}/config/ship.json`
  }
}
