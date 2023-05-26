import { Substitute } from '@fluffy-spoon/substitute'
import { PackageJsonDependency } from '@microsoft/rush-lib/lib/api/PackageJsonEditor'
import { VersionMismatchFinderEntity } from '@microsoft/rush-lib/lib/logic/versionMismatch/VersionMismatchFinderEntity'
import * as SemVer from 'semver'

import { VersionMismatchFinder } from '~/contracts'
import { LatestVersionMismatchStrategy } from '~/services/mismatch-strategies/latest-version'
import { VersioningService } from '~/services/versioning'

describe('LatestVersionMismatchStrategy', () => {
  describe('normalize', () => {
    it('should update all consumers to the latest supported version', async () => {
      // Create mocks
      const versioningService = new VersioningService(SemVer)
      const mismatchFinder = Substitute.for<VersionMismatchFinder>()
      const packageC = Substitute.for<VersionMismatchFinderEntity>()
      const packageD = Substitute.for<VersionMismatchFinderEntity>()
      const packageC_depA = Substitute.for<PackageJsonDependency>()
      const packageD_depA = Substitute.for<PackageJsonDependency>()
      const packageD_depB = Substitute.for<PackageJsonDependency>()

      // Mock mismatch results
      mismatchFinder.getMismatches().returns(['@test/a', '@test/b'])
      mismatchFinder.getVersionsOfMismatch('@test/a').returns(['1.0.1', '1.0.2', '1.0.3'])
      mismatchFinder.getVersionsOfMismatch('@test/b').returns(['>2.0.1', '>=3.0.0'])
      mismatchFinder.getConsumersOfMismatch('@test/a', '1.0.1').returns([packageC])
      mismatchFinder.getConsumersOfMismatch('@test/a', '1.0.2').returns([packageD])
      mismatchFinder.getConsumersOfMismatch('@test/b', '>2.0.1').returns([packageD])

      // Mock package results
      packageC.tryGetDependency('@test/a').returns(packageC_depA)
      packageD.tryGetDependency('@test/a').returns(packageD_depA)
      packageD.tryGetDependency('@test/b').returns(packageD_depB)

      // Execute
      const latestVersionStrategy = new LatestVersionMismatchStrategy(versioningService)
      await latestVersionStrategy.normalize(mismatchFinder)

      // Make assertions
      packageC_depA.received(1).setVersion('1.0.3')
      packageD_depA.received(1).setVersion('1.0.3')
      packageD_depB.received(1).setVersion('3.0.0')
      packageC.received(1).saveIfModified()
      packageD.received(2).saveIfModified()
    })
  })
})
