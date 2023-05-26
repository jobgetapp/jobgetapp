import { Contracts } from '@jobgetapp/ship-plugin'

import {
  BuildServiceContract,
  ImageServiceContract,
  ChangeServiceContract,
  ProjectTagServiceContract
} from '~/contracts'

/**
 * Service for managing the docker build process
 */
export class BuildService implements BuildServiceContract {
  protected readonly defaultBuildType = 'default'

  /**
   * Create new BuildService
   * @param rushConfiguration -
   * @param dockerService -
   * @param changeService -
   * @param projectTagService -
   * @param pathService -
   * @param configService -
   */
  public constructor (
    protected readonly rushConfiguration: Contracts.RushConfiguration,
    protected readonly dockerService: Contracts.Docker.DockerServiceContract,
    protected readonly changeService: ChangeServiceContract,
    protected readonly imageService: ImageServiceContract,
    protected readonly projectTagService: ProjectTagServiceContract,
    protected readonly pathService: Contracts.ShipPathServiceContract,
    protected readonly configService: Contracts.ShipConfigServiceContract,
    protected readonly config: Contracts.ShipGlobalConfig
  ) {}

  /**
   * Builds the root docker container containing the entire rush repo
   * @param tag - Tag to apply to the output image
   */
  public async buildRepo (tag?: string): Promise<void> {
    await this.dockerService.buildImage(this.rushConfiguration.rushJsonFolder, {
      tag: tag || await this.dockerService.createCurrentRepoTag(),
      dockerFile: this.pathService.repoDockerFile,
      args: {
        REPO_NAME: this.config.name
      }
    })
    await this.dockerService.pruneImages()
  }

  /**
   * Runs the project build orchestration container, running both the
   * build step and the final output image step.
   * @param project - Project to build
   * @param repoTag - Overrides the project build image
   * @param tag - Tag to apply to output image
   */
  public async buildProject (
    project: Contracts.RushConfigurationProject,
    repoTag?: string,
    tag?: string
  ): Promise<void> {
    // Create default project image tag
    const defaultTag = await this.projectTagService.getProjectTag(project)

    // Create the default tag of the build image to use
    const projectTag = tag || defaultTag
    const config = await this.configService.getProjectConfig(project, this.config.env)

    if (!config) {
      throw new Error(`Unable to find config/ship.json in ${project.packageName}.`)
    }

    const buildArgs: {[key: string]: string} = {
      REPO_NAME: this.config.name,
      REPO_IMAGE: repoTag || await this.dockerService.createCurrentRepoTag(),
      PROJECT_BASE_IMAGE: await this.imageService.resolveBaseImage(config.image),
      PROJECT: project.packageName,
      PROJECT_PATH: project.projectRelativeFolder
    }

    if (this.config.env) {
      buildArgs.SHIP_ENV = this.config.env
    }

    await this.dockerService.buildImage(this.rushConfiguration.rushJsonFolder, {
      tag: projectTag,
      dockerFile: this.pathService.getBuildDockerFile(config.buildType || this.defaultBuildType),
      args: buildArgs
    })
    await this.dockerService.pruneImages()
  }
}
