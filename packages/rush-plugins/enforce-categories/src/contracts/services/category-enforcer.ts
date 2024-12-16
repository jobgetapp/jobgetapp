export interface CategoryRestrictionContract {
  readonly category: string
  readonly forbiddenCategories: string[]
}

export interface CategoryEnforcerConfigContract {
  readonly categoryRestrictions: CategoryRestrictionContract[]
}

export interface CategoryEnforcerServiceContract {
  run (): void
}
