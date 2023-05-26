/**
 * Options passed to docker daemon when building project image.
 */
export type DockerBuildOptions = {
  // The tag to apply to the new image.
  tag: string
  // The dockerfile that should be used.
  dockerFile: string
  // Build arguments for the dockerfile.
  args?: Record<string, string|number>
  // The platform architecture that should
  // be used when building images. Defaults to linux/x86.
  platform?: string
}

/**
 * Options passed to docker daemon when tagging a docker image.
 */
export type DockerTagOptions = {
  // The image to tag.
  tag: string
  // The new tag for the image.
  newTag: string
}

/**
 * Options passed to docker daemon when pushing an image to a repository.
 */
export type DockerPushOptions = {
  // The tag of the image to push.
  tag: string
  // If set, all tags for the image will be pushed.
  allTags?: boolean
}

/**
 * Options passed to docker daemon when logging into a registry.
 */
export type DockerRegistryLoginOptions = {
  // The hostname of the registry.
  server: string
  // The name of the user account to log into the registry with.
  username: string
  // The API token or password used to authenticate the user.
  token: string
}

/**
 * Options passed to docker daemon when running a docker image.
 */
export type DockerRunOptions = {
  // The tag of the image to run.
  tag: string
  // The command to run in the image. Overrides the image default command.
  command: string[]
  // Entrypoint to use for docker run
  entrypoint?: string[]
  // Environment variables to pass to the image container.
  environment?: Record<string, string>
  // Volumes to mount when running
  volumes?: Record<string, string>
}

/**
 * Service used to manage docker images.
 */
export interface DockerServiceContract {
  /**
   * Create a docker to use for the base repository image.
   */
  createCurrentRepoTag (): Promise<string>

  /**
   * Build a project docker image.
   * @param contextPath - The path to the project directory.
   * @param options - The options used to build the project image.
   */
  buildImage (
    contextPath: string,
    options: DockerBuildOptions
  ): Promise<void>

  /**
   * Remove intermediary build images.
   */
  pruneImages (): Promise<void>

  /**
   * Login to docker registry.
   * @param registry - Registry login options.
   */
  login (
    registry: DockerRegistryLoginOptions
  ): Promise<void>

  /**
   * Apply a new tag to an image.
   * @param options - Options used to create new image tag.
   */
  tagImage (
    options: DockerTagOptions
  ): Promise<void>

  /**
   * Push docker image to repository.
   * @param options - Options used to push image to repository.
   */
  pushImage (
    options: DockerPushOptions
  ): Promise<void>

  /**
   * Execute a docker image.
   * @param options - Options used to execute command using docker image.
   */
  run (
    options: DockerRunOptions
  ): Promise<void>
}
