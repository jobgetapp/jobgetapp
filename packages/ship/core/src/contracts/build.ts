import { Contracts } from '@jobgetapp/ship-plugin'

/**
 * Service for managing the docker build process
 */
export interface BuildServiceContract {
  /**
   * Builds the root docker container containing the entire rush repo
   * @param tag - Tag to apply to the output repo image
   */
  buildRepo (tag?: string): Promise<void>

  /**
   * Runs the project build orchestration container, running both the
   * build step and the final output image step.
   * @param project - Project to build
   * @param repoTag - Overrides the project repo image
   * @param tag - Tag to apply to output image
   */
  buildProject (
    project: Contracts.RushConfigurationProject,
    repoTag?: string,
    tag?: string
  ): Promise<void>
}
