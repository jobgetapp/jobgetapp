import { RushConfiguration } from '@rushstack/rush-sdk/lib/api/RushConfiguration'
import { VersionMismatchFinder } from '@rushstack/rush-sdk/lib/logic/versionMismatch/VersionMismatchFinder'
import * as SemVer from 'semver'

import {
  LatestVersionMismatchStrategy
} from '~/services/mismatch-strategies'
import { VersioningService } from '~/services/versioning'

/**
 * Entry point
 * Setup services and inject dependencies here.
 */
const run = async (): Promise<void> => {
  const rushConfiguration = RushConfiguration.loadFromDefaultLocation({
    startingFolder: process.cwd()
  })
  const versioningService = new VersioningService(SemVer)
  const latestVersionMismatchStrategy = new LatestVersionMismatchStrategy(versioningService)
  await latestVersionMismatchStrategy.normalize(
    VersionMismatchFinder.getMismatches(rushConfiguration)
  )
}

void (async (): Promise<void> => {
  await run()
  console.log('done')
})()
