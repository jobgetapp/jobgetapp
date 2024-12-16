import { ITerminal } from '@rushstack/node-core-library'
import { CommandLineAction } from '@rushstack/ts-command-line'

import { CategoryEnforcerServiceContract } from '~/contracts'

/**
 * Action used to enforce category relationships.
 */
export class EnforceAction extends CommandLineAction {
  /**
   * Create a new EnforceAction
   */
  public constructor (
    protected readonly terminal: ITerminal,
    protected readonly categoryEnforcerService: CategoryEnforcerServiceContract
  ) {
    super({
      actionName: 'enforce',
      summary: 'Create the base build image.',
      documentation: `
        Creates an image after building and testing all changed projects.
      `
    })
  }

  /**
   * Register command input parameters.
   */
  protected onDefineParameters (): void {}

  /**
   * Execute command.
   */
  protected onExecute (): Promise<void> {
    return Promise.resolve(this.categoryEnforcerService.run())
  }
}
