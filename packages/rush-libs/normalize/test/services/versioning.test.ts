import * as SemVer from 'semver'

import { VersioningService } from '~/services/versioning'

describe('VersioningService', () => {
  describe('hasSameMinimumVersion', () => {
    it('should return true when both minimum versions are the same', () => {
      // Execute
      const versioningService = new VersioningService(SemVer)

      // Make assertions
      expect(versioningService.hasSameMinimumVersion('1.0.0', '>=1.0.0')).toBeTrue()
      expect(versioningService.hasSameMinimumVersion('1.0.1', '>=1.0.1')).toBeTrue()
      expect(versioningService.hasSameMinimumVersion('1.1.0', '>=1.1.0')).toBeTrue()
      expect(versioningService.hasSameMinimumVersion('2.0.0', '>=1.0.0')).toBeFalse()
    })
  })

  describe('getLatestMinimumVersion', () => {
    it('should return the latest version', () => {
      // Execute
      const versioningService = new VersioningService(SemVer)

      // Make assertions
      expect(versioningService.getLatestMinimumVersion('1.0.0', '1.0.0')).toBe('1.0.0')
      expect(versioningService.getLatestMinimumVersion('1.0.0', '1.0.1')).toBe('1.0.1')
      expect(versioningService.getLatestMinimumVersion('1.0.1', '1.0.0')).toBe('1.0.1')

      expect(versioningService.getLatestMinimumVersion('>2.0.0', '1.0.1')).toBe('2.0.1')
      expect(versioningService.getLatestMinimumVersion('2.0.0', '>1.0.1')).toBe('2.0.0')
      expect(versioningService.getLatestMinimumVersion('>=2.0.0', '>=1.0.0')).toBe('2.0.0')
    })
  })
})
