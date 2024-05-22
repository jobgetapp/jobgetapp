import * as path from 'path'

import type { Config } from '@jest/types'

export const JestConfig = (options: {
  forBrowser?: boolean
  tsconfigPath?: string
} = {}): Promise<Config.InitialOptions> => Promise.resolve({
  verbose: true,
  collectCoverage: false,
  testEnvironment: options.forBrowser ? 'jsdom' : 'node',
  setupFilesAfterEnv: [
    'jest-extended/all'
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
    '^.+\\.tsx?$': ['@swc/jest', {}]
  },
  moduleNameMapper: {
    '~/(.*)': '<rootDir>/src/$1'
  }
})
