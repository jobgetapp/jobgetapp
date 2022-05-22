import * as path from 'path'

import type { Config } from '@jest/types'

export const JestConfig = (options: {
  forBrowser?: boolean
} = {}): Promise<Config.InitialOptions> => Promise.resolve({
  verbose: true,
  collectCoverage: true,
  testEnvironment: options.forBrowser ? 'jsdom' : 'node',
  setupFilesAfterEnv: [
    'jest-extended'
  ],
  reporters: [
    path.resolve(__dirname, 'fixed-reporter')
  ],
  coverageReporters: [
    'json',
    'lcov',
    'text-summary',
    'clover'
  ],
  coverageDirectory: '<rootDir>/.coverage',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}'
  ],
  testMatch: [
    '<rootDir>/test/**/*.test.ts'
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleNameMapper: {
    '~/(.*)': '<rootDir>/src/$1'
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/test/tsconfig.json'
    }
  }
})
