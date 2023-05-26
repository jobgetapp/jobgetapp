import * as fs from 'fs'
import * as path from 'path'

import {
  BuildService,
  ImageService,
  ChangeService,
  ProjectTagService,
  PluginExecutorService
} from '@jobgetapp/ship-core'
import {
  DockerService,
  ShipPathService,
  ExecutionService,
  ShipSchemaService,
  ShipConfigService,
  Contracts as PluginContracts
} from '@jobgetapp/ship-plugin'
import {
  LockFile,
  Terminal,
  JsonFile,
  Executable,
  JsonSchema,
  ConsoleTerminalProvider
} from '@rushstack/node-core-library'

import { ShipCLI } from '~/cli'

const run = async (): Promise<void> => {
  const rushConfiguration = PluginContracts.RushConfiguration.loadFromDefaultLocation({
    startingFolder: process.cwd()
  })

  const schemaService = new ShipSchemaService(JsonSchema)
  const pathService = new ShipPathService(rushConfiguration)
  const configService = new ShipConfigService(JsonFile, pathService, schemaService)
  const config: PluginContracts.ShipGlobalConfig = await configService.getGlobalConfig()
  const changeManager = new PluginContracts.ChangeManager(rushConfiguration, new Set())
  const changeService = new ChangeService(rushConfiguration, changeManager, configService, config)
  const terminal = new Terminal(new ConsoleTerminalProvider())
  const executionService = new ExecutionService(Executable, terminal)
  const dockerService = new DockerService(config, executionService, terminal)
  const projectTagService = new ProjectTagService(changeService, config)
  const imageService = new ImageService(dockerService, pathService, config)
  const buildService = new BuildService(
    rushConfiguration,
    dockerService,
    changeService,
    imageService,
    projectTagService,
    pathService,
    configService,
    config
  )
  const pluginExecutorService = new PluginExecutorService(
    rushConfiguration,
    terminal,
    LockFile,
    projectTagService,
    pathService,
    imageService,
    dockerService,
    configService,
    config,
    process.env,
    fs,
    path
  )
  const shipCLI = new ShipCLI(
    rushConfiguration,
    changeService,
    buildService,
    pluginExecutorService,
    terminal
  )
  await shipCLI.execute()
}

void (async (): Promise<void> => {
  await run()
})()
