import { VersionMismatchFinder } from '@microsoft/rush-lib/lib/logic/versionMismatch/VersionMismatchFinder'

export { RushConfiguration } from '@microsoft/rush-lib/lib/api/RushConfiguration'
export { VersionMismatchFinder } from '@microsoft/rush-lib/lib/logic/versionMismatch/VersionMismatchFinder'

/**
 * Service for executing a strategy to
 * resolve package version mismatch errors.
 */
export interface MismatchStrategyContract {
  /**
   * Normalize package versions to resolve mismatch error
   * @param mismatchFinder - The finder containing current rush repo mismatch errors.
   */
  normalize (
    mismatchFinder: VersionMismatchFinder
  ): Promise<void>
}
