import { ITerminal } from '@rushstack/node-core-library'
import {
  RushConfiguration,
  RushConfigurationProject
} from '@rushstack/rush-sdk'
import { IChangeInfo } from '@rushstack/rush-sdk/lib/api/ChangeManagement'
import { ChangeManager } from '@rushstack/rush-sdk/lib/logic/ChangeManager'

import { ChangedProjectContract, GetChangedProjectsOptionsContract } from '~/contracts'

/**
 * Internal type for handling changed projects
 */
type InternalChangedProject = IChangeInfo & {
  /**
   * Reference to the project configuration
   */
  project: RushConfigurationProject
}

/**
 * Service for managing project change state
 */
export class ChangeService {
  /**
   * Create new ChangeService
   * @param rushConfiguration - Rush repo configuration
   * @param changeManager - Rush internal change management service
   */
  public constructor (
    protected readonly rushConfiguration: RushConfiguration,
    protected readonly changeManager: ChangeManager,
    protected readonly terminal: ITerminal
  ) {}

  /**
   * Get all changed projects in the rush repo meeting the provided conditions
   * @param options - Options to filter projects
   */
  public async getChangedProjects (
    options: GetChangedProjectsOptionsContract = {}
  ): Promise<ChangedProjectContract[]> {
    await this.changeManager.loadAsync(this.rushConfiguration.changesFolder)

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
    const projectsJson = this.changeManager.packageChanges
      // Map to internal format
      .map(change => ({
        ...change,
        project: this.rushConfiguration.projectsByName.get(change.packageName)
      }))
      // Filter results based on requested conditions
      .filter(filter)
      // Map to simple change format
      .map(changeProject => ({
        name: changeProject.packageName,
        unscopedName: changeProject.project.unscopedTempProjectName,
        version: changeProject.newVersion,
        versionPolicyName: changeProject.project.versionPolicyName,
        projectRelativeFolder: changeProject.project.projectRelativeFolder
      }))

    // Ensure each project has a specified version in their package json
    for (const project of projectsJson) {
      if (!project.version) {
        throw new Error(`Could not resolve new version number for package ${project.name}`)
      }
    }

    // Return changed projects
    return projectsJson as ChangedProjectContract[]
  }
}
