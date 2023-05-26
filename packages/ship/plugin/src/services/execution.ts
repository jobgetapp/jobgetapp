import { ITerminal, Executable, IExecutableSpawnOptions } from '@rushstack/node-core-library'

import { ExecutionServiceContract } from '~/contracts'

/**
 * Service used to execute commands on host machine.
 */
export class ExecutionService implements ExecutionServiceContract {
  /**
   * Create a new ExecutionService
   * @param executable - Service used to spawn child processes.
   * @param terminal - Service used to interface with host terminal.
   */
  public constructor (
    protected readonly executable: typeof Executable,
    protected readonly terminal: ITerminal
  ) {}

  /**
   * Attempt to parse and format any returned json data.
   * If this fails, simply return the data buffer as a string.
   * @param data - The incoming data buffer from the process.
   */
  protected formatData (data: any): string {
    try {
      const parsedData = JSON.parse(data.toString())
      return JSON.stringify(parsedData, null, 2)
    } catch {
      return data.toString().trim()
    }
  }

  /**
   * Spawns a new process for a command, resolving a promise
   * when the command has completed.
   * @param process - The process that should be executed.
   * @param args - The arguments that should be passed to the process.
   * @param options - Options used to spawn the new process.
   */
  public asyncSpawn (process: string, args: string[], options?: IExecutableSpawnOptions): Promise<string[]> {
    const child = this.executable.spawn(process, args, options)
    const buffer: string[] = []

    return new Promise((resolve, reject) => {
      const cleanup = (): void => {
        child.stdout?.removeAllListeners()
        child.stderr?.removeAllListeners()
        child.removeAllListeners()
      }

      child.stdout?.on('data', (data: any): void => {
        const formattedData = this.formatData(data)
        buffer.push(formattedData)
        this.terminal.writeLine(formattedData)
      })
      child.stderr?.on('data', (data: any): void => this.terminal.writeErrorLine(this.formatData(data)))

      child.once('close', () => {
        cleanup()
        child.exitCode
          ? reject(new Error(`${process} exit code ${child.exitCode}`))
          : resolve(buffer)
      })
      child.once('error', (ex) => {
        cleanup()
        reject(ex)
      })
    })
  }
}
