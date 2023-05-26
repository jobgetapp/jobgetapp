import { Contracts } from '@jobgetapp/ship-plugin'

import {
  ChangedProject,
  ChangeServiceContract,
  GetChangedProjectsOptions
} from '~/contracts'

/**
 * Internal type for handling changed projects
 */
type InternalChangedProject = Contracts.IChangeInfo & {
  /**
   * Reference to the project configuration
   */
  project: Contracts.RushConfigurationProject
}

/**
 * Service for managing project change state
 */
export class ChangeService implements ChangeServiceContract {
  /**
   * Create new ChangeService
   * @param rushConfiguration - Rush repo configuration
   * @param changeManager - Rush internal change management service
   * @param configService - Service for obtaining ship configurations
   */
  public constructor (
    protected readonly rushConfiguration: Contracts.RushConfiguration,
    protected readonly changeManager: Contracts.ChangeManager,
    protected readonly configService: Contracts.ShipConfigServiceContract,
    protected readonly config: Contracts.ShipGlobalConfig
  ) {
    // Preload rush change state
    changeManager.load(rushConfiguration.changesFolder)
  }

  /**
   * Get all changed projects in the rush repo meeting the provided conditions
   * @param options - Options to filter projects
   */
  public async getChangedProjects (
    options: GetChangedProjectsOptions = {}
  ): Promise<ChangedProject[]> {
    /**
     * Helper function to resolve changed projects with a defined project
     * @param changedProject -
     * @returns
     */
    const filterHasProjects = (
      changedProject: InternalChangedProject
    ): changedProject is InternalChangedProject => !!changedProject.project

    /**
     * Helper function to filter changed projects to the requested version policy
     * @param changedProject -
     * @returns
     */
    const filterListProject = (changedProject: InternalChangedProject): boolean => options.versionPolicyName
      ? options.versionPolicyName === changedProject.project.versionPolicyName
      : true

    /**
     * Helper function to filter changed projects with a path matching an optional pattern
     * @param changedProject -
     * @returns
     */
    const filterProjectPath = (changedProject: InternalChangedProject): boolean => options.pathPattern
      ? (new RegExp(options.pathPattern)).test(changedProject.project.projectRelativeFolder)
      : true

    /**
     * Helper function to filter projects based on provided options
     * @param changedProject -
     * @returns
     */
    const filter = (
      changedProject: any
    ): changedProject is InternalChangedProject =>
      filterHasProjects(changedProject) &&
      filterListProject(changedProject) &&
      filterProjectPath(changedProject)

    // Get changed projects
    const projectsJsonPromises = this.changeManager.changes
      // Map to internal format
      .map(change => ({
        ...change,
        project: this.rushConfiguration.projectsByName.get(change.packageName)
      }))
      // Filter results based on requested conditions
      .filter(filter)
      // Map to simple change format
      .map(async changeProject => ({
        name: changeProject.packageName,
        unscopedName: changeProject.project.unscopedTempProjectName,
        version: changeProject.newVersion,
        versionPolicyName: changeProject.project.versionPolicyName,
        projectRelativeFolder: changeProject.project.projectRelativeFolder,
        config: await this.configService.getProjectConfig(changeProject.project, this.config.env).catch(() => null)
      }))

    // Wait for all project ship configuration files to be resolved
    const projectsJson = (await Promise.all(projectsJsonPromises))
      // Filter out unconfigured projects
      .filter(projectJson => projectJson.config
        ? true
        : !!options.includeUnconfigured
      )
      // Filter out checked out projects
      .filter(projectsJson => {
        if (!projectsJson.config) {
          return true
        }

        return !projectsJson.config.isCheckedOut
      })

    // Ensure each project has a specified version in their package json
    for (const project of projectsJson) {
      if (!project.version) {
        throw new Error(`Could not resolve new version number for package ${project.name}`)
      }
    }

    // Return changed projects
    return projectsJson as ChangedProject[]
  }
}
