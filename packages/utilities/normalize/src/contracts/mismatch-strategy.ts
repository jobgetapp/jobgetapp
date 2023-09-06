import { VersionMismatchFinder } from '@rushstack/rush-sdk/lib/logic/versionMismatch/VersionMismatchFinder'

export { RushConfiguration } from '@rushstack/rush-sdk/lib/api/RushConfiguration'
export { VersionMismatchFinder } from '@rushstack/rush-sdk/lib/logic/versionMismatch/VersionMismatchFinder'

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
