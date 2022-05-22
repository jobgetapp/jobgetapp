/**
 * Service for performing calculations
 * against package versions and dependency
 * semver ranges.
 */
export interface VersioningServiceContract {
  /**
   * Determines if a version satisfies a version range condition
   * @param range1 - Range of first package
   * @param range2 - Range of second package
   */
   hasSameMinimumVersion (range1: string, range2: string): boolean

  /**
   * Gets the semver range containing the
   * latest/newest package version.
   * @param range1 - Range of first package
   * @param range2 - Range of second package
   */
   getLatestMinimumVersion (range1: string, range2?: string): string
}
