import { ITerminal } from '@rushstack/node-core-library'
import { CommandLineParser } from '@rushstack/ts-command-line'

import {
  EnforceAction
} from './actions'

import { CategoryEnforcerServiceContract } from '~/contracts'

/**
 * Enforce categories command line utility.
 */
export class EnforceCategoriesCLI extends CommandLineParser {
  /**
   * Create new EnforceCategoriesCLI
   * @param terminal - Service used to interact with host terminal.
   */
  public constructor (
    protected readonly terminal: ITerminal,
    protected readonly categoryEnforcerService: CategoryEnforcerServiceContract
  ) {
    super({
      toolFilename: 'enforce-categories',
      toolDescription: 'Utility to ensure rush projects to not leak internal code.'
    })

    // Register actions
    this.addAction(new EnforceAction(terminal, categoryEnforcerService))
  }

  protected onDefineParameters (): void {
    // Forced to provided this to satisfy abstract parent contract.
  }
}
