/**
 * Service for managing plugin images
 */
export interface ImageServiceContract {
    /**
   * Get or create a base image
   * @param image - Image to resolve
   * @returns
   */
  resolveBaseImage (
    image: string
  ): Promise<string>
}
