#!/usr/bin/env node

import { Terminal, ConsoleTerminalProvider } from '@rushstack/node-core-library'
import { RushConfiguration } from '@rushstack/rush-sdk'
import { ChangeManager } from '@rushstack/rush-sdk/lib/logic/ChangeManager'

import { GetChangedProjectsOptionsContract } from '~/contracts'
import { ChangeService } from '~/services'

export const terminal: Terminal = new Terminal(new ConsoleTerminalProvider())

process.exitCode = 1

type Writeable<T> = { -readonly [P in keyof T]: T[P] };

const paramsToConfig = (argv: string[]): GetChangedProjectsOptionsContract => {
  const config: Writeable<GetChangedProjectsOptionsContract> = {}
  let index = 0
  while (index < argv.length - 1) {
    const paramFlag = argv[index]
    const paramValue = argv[index + 1]
    if (paramFlag === '-p' || paramFlag === '--version-policy') {
      config.versionPolicyName = paramValue
      index += 2 // Consume flag and value
    } else if (paramFlag === '-m' || paramFlag === '--path-pattern') {
      config.pathPattern = paramValue
      index += 2 // Consume flag and value
    } else {
      index += 1 // Next arg
    }
  }
  return config
}

async function main (): Promise<void> {
  try {
    const rushConfiguration = RushConfiguration.loadFromDefaultLocation({
      startingFolder: process.cwd()
    })
    const changeManager = new ChangeManager(<any> rushConfiguration, new Set())
    const changeService = new ChangeService(rushConfiguration, changeManager, terminal)
    const changes = await changeService.getChangedProjects(paramsToConfig(process.argv))
    terminal.writeLine(JSON.stringify(changes, null, 2))
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
