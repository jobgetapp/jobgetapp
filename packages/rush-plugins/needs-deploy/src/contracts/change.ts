/**
 * Defines a project change state
 */
export interface ChangedProjectContract {
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

export interface GetChangedProjectsOptionsContract {
  /**
   * Version policy to limit changed project results to
   */
  readonly versionPolicyName?: string

  /**
   * If set, projects without a ship configuration will be included in change result
   */
  readonly includeUnconfigured?: boolean

  /**
   * If set, restricts the returned projects to those with a path matching the pattern
   */
  readonly pathPattern?: string
}
