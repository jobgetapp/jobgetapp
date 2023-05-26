import { Contracts } from '@jobgetapp/ship-plugin'

/**
 * Service for executing project plugins
 */
export interface PluginExecutorServiceContract {
  /**
   * Execute all plugins for the provided project
   * @param project - Project to execute plugins for
   */
  execute (
    project: Contracts.RushConfigurationProject,
    tag?: string
  ): Promise<void>
}
