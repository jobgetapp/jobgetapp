import { IExecutableSpawnOptions } from '@rushstack/node-core-library'

/**
 * Service used to execute commands on host machine.
 */
export interface ExecutionServiceContract {
  /**
   * Spawns a new process for a command, resolving a promise
   * when the command has completed.
   * @param process - The process that should be executed.
   * @param args - The arguments that should be passed to the process.
   * @param options - Options used to spawn the new process.
   */
  asyncSpawn (process: string, args: string[], options?: IExecutableSpawnOptions): Promise<string[]>
}
