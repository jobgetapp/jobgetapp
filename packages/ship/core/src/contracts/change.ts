/**
 * Defines a project change state
 */
export type ChangedProject = {
  /**
   * The name of the project
   */
  readonly name: string

  /**
   * The name of the project without npm package scope
   */
  readonly unscopedName: string

  /**
   * The current version of the project
   */
  readonly version: string

  /**
   * The name of the project rush version policy
   */
  readonly versionPolicyName: string

  /**
   * Relative path from repo root to project
   */
  readonly projectRelativeFolder: string
}

/**
 * Options used to obtain changed projects
 */
export type GetChangedProjectsOptions = {
  /**
   * Version policy to limit changed project results to
   */
  versionPolicyName?: string

  /**
   * If set, projects without a ship configuration will be included in change result
   */
  includeUnconfigured?: boolean

  /**
   * If set, restricts the returned projects to those with a path matching the pattern
   */
  pathPattern?: string
}

/**
 * Service for managing project change state
 */
export interface ChangeServiceContract {
  /**
   * Get all changed projects in the rush repo meeting the provided conditions
   * @param options - Options to filter projects
   */
  getChangedProjects (
    options?: GetChangedProjectsOptions
  ): Promise<ChangedProject[]>
}
