import { RushConfigurationProject } from './rush'

/**
 * Service for obtaining ship global file paths
 */
export interface ShipPathServiceContract {
  /**
   * Path to ship root folder (common/config/ship)
   */
  readonly rootFolder: string

  /**
   * Path to ship global configuration file (common/config/ship/config.json)
   */
  readonly configFile: string

  /**
   * Path to container root folder (common/config/ship/containers)
   */
  readonly containersFolder: string

  /**
   * Path to docker build orchestration docker file (common/config/ship/containers/Dockerfile)
   */
  readonly repoDockerFile: string

  /**
   * Path to folder containing project base images (common/config/ship/containers/base)
   */
   readonly baseContainersFolder: string

  /**
   * Path to folder containing project build images (common/config/ship/containers/build)
   */
  readonly buildContainersFolder: string

  /**
   * Path to folder containing project base images (common/config/ship/containers/plugin)
   */
  readonly pluginContainersFolder: string

  /**
   * Path to docker file for a specified build type (common/config/ship/containers/build/$buildType/DockerFile)
   * @param buildType - Dockerfile build type
   * @returns
   */
  getBuildDockerFile (buildType: string): string

  /**
   * Get path to a projects ship configuration file ($project_root/config/ship.json)
   * @param project - Project to get configuration of
   * @returns
   */
  getProjectConfigFile (
    project: RushConfigurationProject,
    env?: string
  ): string
}
