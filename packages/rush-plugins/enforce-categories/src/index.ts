#!/usr/bin/env node

import { Terminal, ConsoleTerminalProvider } from '@rushstack/node-core-library'
import { RushConfiguration } from '@rushstack/rush-sdk'

import { CategoryEnforcerService, ConfigService } from './services'

export const terminal: Terminal = new Terminal(new ConsoleTerminalProvider())

process.exitCode = 1

async function main (): Promise<void> {
  try {
    const rushConfiguration = RushConfiguration.loadFromDefaultLocation({
      startingFolder: process.cwd()
    })
    const configService = new ConfigService(rushConfiguration)
    const config = await configService.load()
    const categoryEnforcerService = new CategoryEnforcerService(terminal, config)
    categoryEnforcerService.run(rushConfiguration)
  } catch (error: any) {
    if (error.message) {
      terminal.writeErrorLine(error.message)
    } else {
      throw error
    }
  }
}

main()
  .then(() => {
    process.exitCode = 0
  })
  .catch(console.error)
