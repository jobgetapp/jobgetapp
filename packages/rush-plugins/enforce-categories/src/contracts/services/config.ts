import { CategoryEnforcerConfigContract } from './category-enforcer'

export interface ConfigServiceContract {
    load (): Promise<CategoryEnforcerConfigContract>
}
