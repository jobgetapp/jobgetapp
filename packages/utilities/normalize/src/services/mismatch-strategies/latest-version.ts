import { VersioningService } from '../versioning'

import {
  MismatchStrategyContract,
  VersionMismatchFinder
} from '~/contracts'

/**
 * {@inheritdoc MismatchStrategyContract}
 */
export class LatestVersionMismatchStrategy implements MismatchStrategyContract {
  /**
   * Create a new LatestVersionMismatchStrategy
   * @param versioningService - Service for comparing package dependency versions.
   */
  public constructor (
    protected readonly versioningService: VersioningService
  ) {}

  /**
   * Updates all consumers of a specific version ofa mismatching package
   * to the latest version that can be supported by all consuming packages.
   * @param mismatch - The mismatching package name
   * @param version - Consumes of this version of the mismatching package will be updated
   * @param mismatchFinder - The mismatch finder for the rush repository
   * @param newVersion - The new version of the mismatching package to apply to consuming packages
   */
  protected fixVersionMismatch = (
    mismatch: string,
    version: string,
    mismatchFinder: VersionMismatchFinder,
    newVersion: string
  ): Promise<void> => {
    const consumers = mismatchFinder.getConsumersOfMismatch(mismatch, version) || []
    for (const consumer of consumers) {
      const dependency = consumer.tryGetDependency(mismatch) || consumer.tryGetDevDependency(mismatch)
      if (dependency) {
        console.log(`Setting ${dependency.name} in ${consumer.friendlyName} to version ${newVersion}`)
        dependency.setVersion(newVersion)
      }
      consumer.saveIfModified()
    }
    return Promise.resolve()
  }

  /**
   * Update all consumers of a mismatching package
   * to the latest version that can be supported by all consuming packages.
   * @param mismatch - The mismatching package name
   * @param mismatchFinder - The mismatch finder for the rush repository
   */
  protected fixPackageMismatch = async (
    mismatch: string,
    mismatchFinder: VersionMismatchFinder
  ): Promise<void> => {
    const versions = mismatchFinder.getVersionsOfMismatch(mismatch)
    const latestVersion = versions
      ?.reduce((latest, version) => this.versioningService.getLatestMinimumVersion(version, latest))

    if (!latestVersion) {
      throw new Error(`Unable to resolve latest version of package: ${mismatch}`)
    }

    const invalidVersions = versions
      ?.filter(version => !this.versioningService.hasSameMinimumVersion(version, latestVersion)) || []
    for (const version of invalidVersions) {
      await this.fixVersionMismatch(mismatch, version, mismatchFinder, latestVersion)
    }
  }

  /**
   * {@inheritdoc MismatchStrategyContract.normalize}
   */
  public async normalize (
    mismatchFinder: VersionMismatchFinder
  ): Promise<void> {
    const mismatches = mismatchFinder.getMismatches()
    for (const mismatch of mismatches) {
      await this.fixPackageMismatch(mismatch, mismatchFinder)
    }
  }
}
