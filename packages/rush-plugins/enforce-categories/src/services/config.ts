import * as path from 'path'

import { JsonFile, JsonSchema } from '@rushstack/node-core-library'
import { RushConfiguration } from '@rushstack/rush-sdk'

import { CategoryEnforcerConfigContract } from '~/contracts'

export class ConfigService {
  public constructor (
    protected readonly rushConfig: RushConfiguration
  ) {}

  public load (): Promise<CategoryEnforcerConfigContract> {
    const schema = JsonSchema.fromFile(path.join(__dirname, '../../schemas/enforce-categories.schema.json'))
    return JsonFile.loadAndValidateAsync(
      `${this.rushConfig.commonFolder}/config/rush-plugins/enforce-categories.json`,
      schema
    )
  }
}
