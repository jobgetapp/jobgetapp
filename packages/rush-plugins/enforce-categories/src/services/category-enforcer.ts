import { ITerminal } from '@rushstack/node-core-library'
import { ApprovedPackagesPolicy, RushConfiguration, RushConfigurationProject } from '@rushstack/rush-sdk'

import { CategoryEnforcerConfigContract } from '~/contracts'

export class CategoryEnforcerService {
  public constructor (
    protected readonly terminal: ITerminal,
    protected readonly config: CategoryEnforcerConfigContract
  ) {}

  protected getCategoryOverlap (categoryListA: string[], categoryListB: string[]): string[] {
    const overlap: string[] = []
    for (const a of categoryListA) {
      if (categoryListB.includes(a)) {
        overlap.push(a)
      }
    }
    return overlap
  }

  protected getProjectCategories (
    approvedPackagesPolicy: ApprovedPackagesPolicy,
    project: RushConfigurationProject
  ): string[] {
    return [
      ...(
        approvedPackagesPolicy.browserApprovedPackages
          .getItemByName(project.packageName)?.allowedCategories || []
      ),
      ...(
        approvedPackagesPolicy.nonbrowserApprovedPackages
          .getItemByName(project.packageName)?.allowedCategories || []
      )
    ]
  }

  protected getProjectRestrictedCategoryOverlap (
    rushConfig: RushConfiguration,
    project: RushConfigurationProject
  ): string[] {
    const categories = this.getProjectCategories(rushConfig.approvedPackagesPolicy, project)
    for (const categoryRestriction of this.config.categoryRestrictions) {
      if (project.reviewCategory === categoryRestriction.category) {
        return this.getCategoryOverlap(categories, categoryRestriction.forbiddenCategories)
      }
    }

    return []
  }

  public run (
    rushConfig: RushConfiguration
  ): any {
    const errors: string[] = []
    for (const project of rushConfig.projects) {
      const result = this.getProjectRestrictedCategoryOverlap(rushConfig, project)
      errors.push(...result.map(category => {
        return `${project.packageName} is restricted by category: ${category}`
      }))
    }

    for (const err of errors) {
      this.terminal.writeErrorLine(err)
    }

    if (errors.length > 0) {
      throw new Error(`Found ${errors.length} category errors`)
    }
  }
}