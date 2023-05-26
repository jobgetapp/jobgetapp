import { Contracts } from '@jobgetapp/ship-plugin'

/**
 * Service for project image tag management
 */
export interface ProjectTagServiceContract {
  /**
   * Creates the tag for a project build image
   * @param project - Project to create tag for
   */
  getProjectTag (project: Contracts.RushConfigurationProject): Promise<string>
}
