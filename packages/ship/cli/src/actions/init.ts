import { Contracts } from '@jobgetapp/ship-core'
import { CommandLineAction, CommandLineStringParameter } from '@rushstack/ts-command-line'

/**
 * Action used to build base repository image.
 */
export class InitAction extends CommandLineAction {
  /**
   * CLI parameter specifying the tag to apply the new repository image.
   */
  protected tag!: CommandLineStringParameter

  /**
   * Create a new InitAction
   * @param buildService - Service used to build docker images.
   */
  public constructor (
    protected readonly buildService: Contracts.BuildServiceContract
  ) {
    super({
      actionName: 'init',
      summary: 'Create the base build image.',
      documentation: `
        Creates an image after building and testing all changed projects.
      `
    })
  }

  /**
   * Register command input parameters.
   */
  protected onDefineParameters (): void {
    this.tag = this.defineStringParameter({
      argumentName: 'TAG_NAME',
      parameterLongName: '--tag',
      parameterShortName: '-t',
      description: 'Optional custom tag to apply to build.',
      required: false
    })
  }

  /**
   * Execute command.
   */
  protected async onExecute (): Promise<void> {
    await this.buildService.buildRepo(this.tag.value)
  }
}
