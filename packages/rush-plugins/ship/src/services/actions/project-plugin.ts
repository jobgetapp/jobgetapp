import { Contracts } from '@jobgetapp/ship-core'
import { Contracts as PluginContracts } from '@jobgetapp/ship-plugin'
import { CommandLineAction, CommandLineStringParameter } from '@rushstack/ts-command-line'

/**
 * Action used to execute plugins for a project.
 */
export class ProjectPluginAction extends CommandLineAction {
  /**
   *
   * CLI parameter specifying the name of the project to execute plugins for.
   */
  protected projectName!: CommandLineStringParameter

  /**
   * CLI parameter specifying the tag to apply the new project image.
   */
  protected tag!: CommandLineStringParameter

  /**
   * Create a new ProjectPluginAction
   * @param rushConfiguration -
   * Configuration for the rush repository.
   * @param pluginExecutorService -
   * Service used to execute plugins for a project.
   */
  public constructor (
    protected readonly rushConfiguration: PluginContracts.RushConfiguration,
    protected readonly pluginExecutorService: Contracts.PluginExecutorServiceContract
  ) {
    super({
      actionName: 'project',
      summary: 'Perform a ship action against a project.',
      documentation: `
        Executes project ship plugins.
      `
    })
  }

  /**
   * Register command input parameters.
   */
  protected onDefineParameters (): void {
    this.projectName = this.defineStringParameter({
      argumentName: 'PROJECT_NAME',
      parameterLongName: '--project-name',
      parameterShortName: '-p',
      description: 'Name of the project to build.',
      required: true
    })

    this.tag = this.defineStringParameter({
      argumentName: 'TAG_NAME',
      parameterLongName: '--tag',
      parameterShortName: '-t',
      description: 'The tag to apply to the build.',
      required: false
    })
  }

  /**
   * Execute command.
   */
  protected async onExecute (): Promise<void> {
    if (!this.projectName.value) {
      throw new Error('Expect value for parameter --project-name, but received none.')
    }

    const project = this.rushConfiguration.getProjectByName(this.projectName.value)
    if (!project) {
      throw new Error(`Could not find project ${this.projectName.value}`)
    }

    await this.pluginExecutorService
      .execute(project, this.tag.value)
  }
}
