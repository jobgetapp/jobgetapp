import { Contracts } from '@jobgetapp/ship-plugin'

import { ChangeServiceContract, ProjectTagServiceContract } from '~/contracts'

/**
 * Service for project image tag management
 */
export class ProjectTagService implements ProjectTagServiceContract {
  /**
   * Create new ProjectTagService
   * @param changeService - Service to handle project change management
   * @param shipConfig - Global ship configuration
   */
  public constructor (
    protected readonly changeService: ChangeServiceContract,
    protected readonly shipConfig: Contracts.ShipGlobalConfig
  ) {}

  /**
   * Creates the tag for a project build image
   * @param project - Project to create tag for
   */
  public async getProjectTag (project: Contracts.RushConfigurationProject): Promise<string> {
    // Get project change state
    const changedProject = (await this.changeService.getChangedProjects())
      .find(candidateProject => candidateProject.name === project.packageName)

    // If project has no change, info require override to continue with build.
    // Unchanged project tags can overwrite pre-existing project build containers.
    const version = changedProject?.version || project.packageJsonEditor.version
    if (!this.shipConfig.allowUnchanged) {
      if (!changedProject) {
        throw new Error(`Could not find any changes for project ${project.packageName}`)
      } else if (!changedProject.version) {
        throw new Error(`Could not find new version information from ${project.packageName}`)
      }
    }

    const projectName = this.shipConfig.env
      ? `${project.unscopedTempProjectName}-${this.shipConfig.env}`
      : project.unscopedTempProjectName

    // Return the versioned tag for the project
    return this.shipConfig.repoScope
      ? `${this.shipConfig.repoScope}/${projectName}:v${version}`
      : `${projectName}:v${version}`
  }
}
