import { Contracts } from '@jobgetapp/ship-core'
import { Contracts as PluginContracts } from '@jobgetapp/ship-plugin'
import { ITerminal } from '@rushstack/node-core-library'
import { CommandLineParser } from '@rushstack/ts-command-line'

import {
  InitAction,
  ListAction,
  BuildAction,
  ProjectPluginAction
} from '~/actions'

/**
 * Ship command line utility.
 */
export class ShipCLI extends CommandLineParser {
  /**
   * Create new ShipCLI
   * @param rushConfiguration - Configuration for the rush repository.
   * @param changeService - Service used to calculate project change information.
   * @param buildService - Service used to build project images.
   * @param pluginExecutorService - Service used to execute project plugins.
   * @param terminal - Service used to interact with host terminal.
   */
  public constructor (
    protected readonly rushConfiguration: PluginContracts.RushConfiguration,
    protected readonly changeService: Contracts.ChangeServiceContract,
    protected readonly buildService: Contracts.BuildServiceContract,
    protected readonly pluginExecutorService: Contracts.PluginExecutorServiceContract,
    protected readonly terminal: ITerminal
  ) {
    super({
      toolFilename: 'ship-cli',
      toolDescription: 'Command line to ship deployable projects.'
    })

    // Register actions
    this.addAction(new InitAction(buildService))
    this.addAction(new BuildAction(rushConfiguration, buildService))
    this.addAction(new ListAction(changeService, terminal))
    this.addAction(new ProjectPluginAction(rushConfiguration, pluginExecutorService))
  }

  protected onDefineParameters (): void {
    // Forced to provided this to satisfy abstract parent contract.
  }
}
