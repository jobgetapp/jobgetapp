import { ITerminal } from '@rushstack/node-core-library'

import {
  Docker,
  ShipGlobalConfig,
  ExecutionServiceContract
} from '~/contracts'

/**
 * Service used to manage docker images.
 */
export class DockerService implements Docker.DockerServiceContract {
  /**
   * Create a new DockerService
   * @param executionService - Service used to execute commands on host machine.
   * @param terminal - Service used to interact with host terminal.
   */
  public constructor (
    protected readonly config: ShipGlobalConfig,
    protected readonly executionService: ExecutionServiceContract,
    protected readonly terminal: ITerminal
  ) {}

  /**
   * Extract the short hash of the rush git repo
   * @returns
   */
  protected async calculateRepoShortHash (): Promise<string> {
    const result = await this.executionService.asyncSpawn('git', [
      'rev-parse',
      '--short',
      'HEAD'
    ])

    return result[0]
  }

  /**
   * Create a docker to use for the base repository image.
   */
  public async createCurrentRepoTag (): Promise<string> {
    return `${this.config.name}:${await this.calculateRepoShortHash()}`
  }

  /**
   * Build a project docker image.
   * @param contextPath - The path to the project directory.
   * @param options - The options used to build the project image.
   */
  public async buildImage (
    contextPath: string,
    options: Docker.DockerBuildOptions
  ): Promise<void> {
    const args = [
      'buildx',
      'build',
      '--platform',
      options.platform || 'linux/amd64',
      '--force-rm',
      '-f',
      `${options.dockerFile}`,
      '-t',
      options.tag
    ]

    // Collect build arguments
    const buildArgs = options.args || {}
    for (const key in buildArgs) {
      const value = buildArgs[key]
      args.push('--build-arg', `${key}=${value.toString()}`)
    }

    this.terminal.writeLine(`${contextPath}`)
    await this.executionService.asyncSpawn('docker', [
      ...args,
      `${contextPath}/`
    ])
  }

  /**
   * Remove intermediary build images.
   */
  public async pruneImages (): Promise<void> {
    await this.executionService.asyncSpawn('docker', ['buildx', 'prune', '-f'])
  }

  /**
   * Login to docker registry.
   * @param credentials - Registry login options.
   */
  public async login (
    credentials: Docker.DockerRegistryLoginOptions
  ): Promise<void> {
    // @TODO Something, something, passwords using command line is insecure. Can we STDIN pipe the password.
    await this.executionService.asyncSpawn('docker', [
      'login',
      '--username',
      credentials.username,
      '--password',
      credentials.token,
      credentials.server
    ])
  }

  /**
   * Apply a new tag to an image.
   * @param options - Options used to create new image tag.
   */
  public async tagImage (
    options: Docker.DockerTagOptions
  ): Promise<void> {
    await this.executionService.asyncSpawn('docker', [
      'tag',
      options.tag,
      options.newTag
    ])
  }

  /**
   * Push docker image to repository.
   * @param options - Options used to push image to repository.
   */
  public async pushImage (
    options: Docker.DockerPushOptions
  ): Promise<void> {
    await this.executionService.asyncSpawn('docker', options.allTags
      ? [
          'push',
          '--all-tags',
          options.tag
        ]
      : [
          'push',
          options.tag
        ]
    )
  }

  /**
   * Execute a docker image.
   * @param options - Options used to execute command using docker image.
   */
  public async run (
    options: Docker.DockerRunOptions
  ): Promise<void> {
    const args = [
      'run',
      '--rm'
    ]

    // Set entry point
    if (options.entrypoint && options.entrypoint.length > 0) {
      args.push('--entrypoint', options.entrypoint.join(' '))
    }

    // Collect environment variables
    const environment = options.environment || {}
    for (const key in environment) {
      const value = environment[key]
      args.push('-e', `${key}=${value}`)
    }

    // Attach volumes
    const volumes = options.volumes || {}
    for (const key in volumes) {
      const value = volumes[key]
      args.push('-v', `${key}:${value}`)
    }

    await this.executionService.asyncSpawn('docker', [
      ...args,
      options.tag,
      ...options.command
    ])
  }
}
