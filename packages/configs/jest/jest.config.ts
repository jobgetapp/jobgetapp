import type { Config } from '@jest/types'
import { JestConfig } from './dist'

export default async (): Promise<Config.InitialOptions> => {
  const config: Config.InitialOptions = {
    ...(await JestConfig()),
    coveragePathIgnorePatterns: [
      '/contracts/',
      '/examples/',
      '/src/index.ts'
    ],
  }

  if (process.env.MAX_JEST_WORKERS) {
    config.maxWorkers = parseInt(process.env.MAX_JEST_WORKERS)
  }

  return config
}