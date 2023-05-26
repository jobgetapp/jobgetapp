import { ITerminal } from '@rushstack/node-core-library'
import { RushConfiguration, ApprovedPackagesPolicy } from '@rushstack/rush-sdk'
import { CommandLineParser } from '@rushstack/ts-command-line'

import {
  CheckReviewCategoriesAction
} from '~/actions'

/**
 * Ship command line utility.
 */
export class CheckReviewCategoriesCLI extends CommandLineParser {
  /**
   * Create new CheckReviewCategoriesCLI
   * @param rushConfiguration - Configuration for the rush repository.
   * @param approvedPackagesPolicy - Manager for approved packages list
   * @param terminal - Service used to interact with host terminal.
   */
  public constructor (
    protected readonly rushConfiguration: RushConfiguration,
    protected readonly approvedPackagesPolicy: ApprovedPackagesPolicy,
    protected readonly terminal: ITerminal
  ) {
    super({
      toolFilename: 'check-review-categories',
      toolDescription: 'Rush utility to ensure projects to not leak protected code.'
    })

    // Register actions
    this.addAction(new CheckReviewCategoriesAction(rushConfiguration, approvedPackagesPolicy, terminal))
  }

  protected onDefineParameters (): void {
    // Forced to provided this to satisfy abstract parent contract.
  }
}
