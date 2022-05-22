import * as SemVer from 'semver'

import { VersioningServiceContract } from '~/contracts'

/**
 * {@inheritdoc VersioningServiceContract}
 */
export class VersioningService implements VersioningServiceContract {
  /**
   * Creates a new VersioningService
   * @param semVer - Service for manipulating semver strings.
   */
  public constructor (
    protected readonly semVer: typeof SemVer
  ) {}

  /**
   * {@inheritdoc VersioningService.satisfies}
   */
  public hasSameMinimumVersion (range1: string, range2: string): boolean {
    const minVersion1 = this.semVer.minVersion(range1)
    const minVersion2 = this.semVer.minVersion(range2)
    if (!minVersion1 || !minVersion2) {
      throw new Error('Could not get min version from provided range.')
    }

    return this.semVer.eq(minVersion1, minVersion2)
  }

  /**
   * {@inheritdoc VersioningServiceContract.getLatestVersion}
   */
  public getLatestMinimumVersion (range1: string, range2?: string): string {
    if (!range2) {
      return range1
    }

    const minVersion1 = this.semVer.minVersion(range1)
    const minVersion2 = this.semVer.minVersion(range2)
    if (!minVersion1 || !minVersion2) {
      throw new Error('Could not get min version from provided range.')
    }

    return this.semVer.gt(minVersion1, minVersion2)
      ? minVersion1.format()
      : minVersion2.format()
  }
}
