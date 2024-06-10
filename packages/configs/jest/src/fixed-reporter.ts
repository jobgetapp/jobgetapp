import * as Path from 'path'

import { VerboseReporter, TestResult, Config } from '@jest/reporters'

export default class FixedReporter extends VerboseReporter {
  // https://github.com/facebook/jest/blob/4453901c0239939cc2c1c8b7c7d121447f6f5f52/packages/jest-reporters/src/DefaultReporter.ts#L28
  // https://github.com/facebook/jest/blob/4453901c0239939cc2c1c8b7c7d121447f6f5f52/packages/jest-reporters/src/BaseReporter.ts#L21-L23
  public log (message: string): void {
    process.stdout.write(`${message}\n`)
  }

  // https://github.com/facebook/jest/blob/4453901c0239939cc2c1c8b7c7d121447f6f5f52/packages/jest-reporters/src/DefaultReporter.ts#L196-L207
  public printTestFileFailureMessage (_testPath: string, _config: Config.ProjectConfig, result: TestResult): void {
    try {
      this.log = (message): boolean => process.stderr.write(`${message}\n`)
      return super.printTestFileFailureMessage(_testPath, _config, result)
    } finally {
      this.log = (message): boolean => process.stdout.write(`${message}\n`)
    }
  }
}

export const getReporterPath = (): string => Path.resolve(__dirname, 'fixed-reporter')
