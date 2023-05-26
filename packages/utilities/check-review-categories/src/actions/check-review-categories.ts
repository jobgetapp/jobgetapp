import * as path from 'path'

import { ITerminal, JsonFile, JsonSchema } from '@rushstack/node-core-library'
import {
  RushConfiguration,
  ApprovedPackagesPolicy,
  RushConfigurationProject
} from '@rushstack/rush-sdk'
import { CommandLineAction } from '@rushstack/ts-command-line'

type ReviewCategoryRestriction = {
  projectPathPattern: string
  reviewCategory: string
}

type ReviewCategoryCheckConfig = {
  projects: ReviewCategoryRestriction[]
}

/**
 * Action used to build base repository image.
 */
export class CheckReviewCategoriesAction extends CommandLineAction {
  /**
   * Create a new CheckReviewCategoriesAction.
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
      actionName: 'check-review-categories',
      summary: 'Check project review categories.',
      documentation: `
        Checks the review categories of each project, ensuring non are contained in a forbidden category.
      `
    })
  }

  /**
   * Register command input parameters.
   */
  protected onDefineParameters (): void {}

  protected loadConfiguration (): Promise<ReviewCategoryCheckConfig> {
    const schema = JsonSchema.fromFile(path.join(__dirname, '../../schemas/review-category-check.schema.json'))
    return JsonFile.loadAndValidateAsync(
      `${this.rushConfiguration.commonFolder}/config/jobgetapp/review-category-check.json`,
      schema
    )
  }

  protected hasRestrictedCategory (
    project: RushConfigurationProject,
    restriction: ReviewCategoryRestriction
  ): boolean {
    if ((new RegExp(restriction.projectPathPattern)).test(project.projectRelativeFolder)) {
      const reviewCategories = [
        ...(
          this.approvedPackagesPolicy.browserApprovedPackages
            .getItemByName(project.packageName)?.allowedCategories || []
        ),
        ...(
          this.approvedPackagesPolicy.nonbrowserApprovedPackages
            .getItemByName(project.packageName)?.allowedCategories || []
        )
      ]

      return reviewCategories.includes(restriction.reviewCategory)
    }
    return false
  }

  protected async checkProject (
    project: RushConfigurationProject
  ): Promise<[RushConfigurationProject, ReviewCategoryRestriction][]> {
    const config = await this.loadConfiguration()
    const failingProjects: [RushConfigurationProject, ReviewCategoryRestriction][] = []

    this.terminal.writeLine(`Checking ${project.projectRelativeFolder}`)
    for (const restriction of config.projects) {
      if (this.hasRestrictedCategory(project, restriction)) {
        failingProjects.push([project, restriction])
      }
    }

    return failingProjects
  }

  /**
   * Execute command.
   */
  protected async onExecute (): Promise<void> {
    const failingProjects: [RushConfigurationProject, ReviewCategoryRestriction][] = []

    for (const project of this.rushConfiguration.projects) {
      failingProjects.push(...(await this.checkProject(project)))
    }

    for (const [project, restriction] of failingProjects) {
      this.terminal.writeErrorLine([
        `Project [${project.packageName}] is part of the restricted category [${restriction.reviewCategory}]`,
        `as matched by [${restriction.projectPathPattern}]`
      ].join(' '))
    }

    return failingProjects.length === 0
      ? Promise.resolve()
      : Promise.reject(new Error(`Found ${failingProjects.length} projects in restricted review categories`))
  }
}
