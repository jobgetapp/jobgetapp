import { Contracts } from '@jobgetapp/ship-core'
import { ITerminal } from '@rushstack/node-core-library'
import { CommandLineAction, CommandLineFlagParameter, CommandLineStringParameter } from '@rushstack/ts-command-line'

/**
 * Action used to list project change information.
 */
export class ListAction extends CommandLineAction {
  /**
   *
   * CLI parameter used to narrow change results to projects with a specific version policy
   */
  protected versionPolicy!: CommandLineStringParameter

  /**
   *
   * CLI parameter used to narrow change results to projects with a path matching the pattern
   */
  protected pathPattern!: CommandLineStringParameter

  /**
   *
   * CLI flag that when provided will include plugins without a ship.json file in the change list.
   */
  protected includeUnconfigured!: CommandLineFlagParameter

  /**
   * Create a new ListAction
   * @param changeService - Service used to calculate project change information.
   * @param terminal - Service used to interact with host terminal.
   */
  public constructor (
    protected readonly changeService: Contracts.ChangeServiceContract,
    protected readonly terminal: ITerminal
  ) {
    super({
      actionName: 'list',
      summary: 'List all deployable projects that will be shipped.',
      documentation: `
        Looks for projects with the deployable version policy and has
        active changes under common/changes. Returns a list of all projects.
      `
    })
  }

  /**
   * Register command input parameters.
   */
  protected onDefineParameters (): void {
    this.versionPolicy = this.defineStringParameter({
      argumentName: 'VERSION_POLICY_NAME',
      parameterLongName: '--version-policy',
      parameterShortName: '-p',
      description: 'Change the version used to gather deployable projects.',
      required: false
    })

    this.pathPattern = this.defineStringParameter({
      argumentName: 'PATH_PATTERN',
      parameterLongName: '--path-pattern',
      parameterShortName: '-m',
      description: 'Refines results to projects to those with a path matching the provided pattern.',
      required: false
    })

    this.includeUnconfigured = this.defineFlagParameter({
      parameterLongName: '--include-unconfigured',
      parameterShortName: '-i',
      // eslint-disable-next-line max-len
      description: 'Include projects not have ship.json file.',
      required: false
    })
  }

  /**
   * Execute command.
   */
  protected async onExecute (): Promise<void> {
    const changedProjects = await this.changeService.getChangedProjects({
      versionPolicyName: this.versionPolicy.value,
      includeUnconfigured: this.includeUnconfigured.value,
      pathPattern: this.pathPattern.value
    })

    this.terminal.writeLine(JSON.stringify(changedProjects, null, 2))
  }
}
