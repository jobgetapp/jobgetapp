import { Contracts } from '@jobgetapp/ship-core'
import { Contracts as PluginContracts } from '@jobgetapp/ship-plugin'
import { CommandLineAction, CommandLineStringParameter } from '@rushstack/ts-command-line'

/**
 * Action used to build project images.
 */
export class BuildAction extends CommandLineAction {
  /**
   * CLI parameter specifying the name of the project to build.
   */
  protected projectName!: CommandLineStringParameter

  /**
   * CLI parameter specifying the tag to apply the new project image.
   */
  protected tag!: CommandLineStringParameter

  /**
   * CLI parameter specifying the tag of the repository base image to build from.
   */
  protected repoTag!: CommandLineStringParameter

  /**
   * Create a new BuildAction
   * @param rushConfiguration - Configuration for the current rush repository.
   * @param buildService - Service used to build docker images.
   */
  public constructor (
    protected readonly rushConfiguration: PluginContracts.RushConfiguration,
    protected readonly buildService: Contracts.BuildServiceContract
  ) {
    super({
      actionName: 'build',
      summary: 'Build project image.',
      documentation: `
        Creates a.
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

    this.repoTag = this.defineStringParameter({
      argumentName: 'TAG_NAME',
      parameterLongName: '--repo-tag',
      parameterShortName: '-r',
      description: 'Tag of repo image to build from.',
      required: false
    })
  }

  /**
   * Execute command.
   */
  protected async onExecute (): Promise<void> {
    if (this.projectName.value) {
      const project = this.rushConfiguration.getProjectByName(this.projectName.value)
      if (!project) {
        throw new Error(`Could not find project ${this.projectName.value}`)
      }
      await this.buildService.buildProject(project, this.repoTag.value, this.tag.value)
    } else {
      throw new Error('Project name no provided')
    }
  }
}
