import { ConsoleTerminalProvider, Terminal } from '@rushstack/node-core-library'
import { RushConfiguration, ApprovedPackagesPolicy } from '@rushstack/rush-sdk'

import { CheckReviewCategoriesCLI } from '~/cli'

const run = async (): Promise<void> => {
  const rushConfiguration = RushConfiguration.loadFromDefaultLocation({
    startingFolder: process.cwd()
  })
  const approvedPackagesConfiguration = new ApprovedPackagesPolicy(
    rushConfiguration,
    rushConfiguration.rushConfigurationJson
  )
  const terminal = new Terminal(new ConsoleTerminalProvider())

  const cli = new CheckReviewCategoriesCLI(
    rushConfiguration,
    approvedPackagesConfiguration,
    terminal
  )
  await cli.execute()
}

void (async (): Promise<void> => {
  await run()
})()
