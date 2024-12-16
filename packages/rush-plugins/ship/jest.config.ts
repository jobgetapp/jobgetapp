import type { Config } from '@jest/types'
import { JestConfig } from '@jobgetapp/jest-config'

export default async (): Promise<Config.InitialOptions> => {
  return {
    ...(await JestConfig()),
    coveragePathIgnorePatterns: [
    ],
  }
}