import { Contracts } from '@jobgetapp/ship-plugin'

import { ImageServiceContract } from '~/contracts'

/**
 * Service for managing plugin images
 */
export class ImageService implements ImageServiceContract {
  /**
   * Create new PluginImageService
   * @param dockerService -
   * @param pathService -
   */
  public constructor (
    protected readonly dockerService: Contracts.Docker.DockerServiceContract,
    protected readonly pathService: Contracts.ShipPathServiceContract,
    protected readonly config: Contracts.ShipGlobalConfig
  ) {}

  /**
   * Get or create a base image
   * @param image - Image to resolve
   * @returns
   */
  public async resolveBaseImage (
    image: string
  ): Promise<string> {
    if (!image.startsWith('//')) {
      // If the image is not internal then return the provided image
      return Promise.resolve(image)
    } else {
      // Create new tag for provided image
      const baseType = image.slice(2)
      const imageTag = `${this.config.name}-${baseType}:latest`

      // Build the requested image
      await this.dockerService.buildImage(`${this.pathService.baseContainersFolder}/${baseType}`, {
        tag: imageTag,
        dockerFile: `${this.pathService.baseContainersFolder}/${baseType}/Dockerfile`
      })

      return imageTag
    }
  }
}
