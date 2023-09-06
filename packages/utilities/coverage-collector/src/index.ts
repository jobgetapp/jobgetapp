// Copyright (c) WarnerMedia Direct, LLC. All rights reserved. Licensed under the MIT license.
// See the LICENSE file for license information.

// Generic imports
import * as fs from 'fs'

// Istanbul-related imports
import { JsonFile } from '@rushstack/node-core-library'
import { RushConfiguration } from '@rushstack/rush-sdk'
import glob from 'glob'
import { CoverageMap, CoverageMapData, createCoverageMap, createFileCoverage } from 'istanbul-lib-coverage'
import { Context, ReportBase, createContext } from 'istanbul-lib-report'
import { create as createReport } from 'istanbul-reports'

const generateEmptyCoverage = async (
  projectFolder: string
): Promise<CoverageMap> => {
  const coverageMap: CoverageMap = createCoverageMap({})
  console.log(`Generating empty coverage for ${projectFolder}`)

  const files = await new Promise<string[]>((resolve, reject) => {
    glob(projectFolder + '/**/*.{ts,js,tsx,jsx,vue}', {
      absolute: true,
      ignore: [
        projectFolder + '/node_modules/**/*',
        projectFolder + '/dist/**/*',
        projectFolder + '/**/*.d.ts'
      ]
    }, (err, result) => err ? reject(err) : resolve(result))
  })

  for (const file of files) {
    console.log('adding', file)
    coverageMap.addFileCoverage(createFileCoverage(file))
  }

  return coverageMap
}

const collectCodeCoverage = async (): Promise<void> => {
  // Get information about rush projects
  const config: RushConfiguration = RushConfiguration.loadFromDefaultLocation()
  const projectFolders: string[] = config.projects.map(project => project.projectFolder)
  const destinationFolder = `${config.rushJsonFolder}/common/temp/coverage`

  // Merge the "coverage-final.json" from each project into one big coverage map
  const coverageMap: CoverageMap = createCoverageMap({})
  for (const projectFolder of projectFolders) {
    try {
      const resultPath = `${projectFolder}/.coverage/coverage-final.json`
      const coverageResult: CoverageMapData = JsonFile.load(resultPath)
      coverageMap.merge(coverageResult)
    } catch (ex: any) {
      if (ex.code !== 'ENOENT') {
        throw ex
      } else {
        coverageMap.merge(await generateEmptyCoverage(projectFolder))
      }
    }
  }

  // Prepare destination folder and report context
  fs.mkdirSync(destinationFolder, { recursive: true })
  const context: Context = createContext({
    dir: destinationFolder,
    coverageMap
  })

  // Write the html-monorepo report
  const htmlReport: ReportBase = createReport('istanbul-reporter-html-monorepo' as any, {
    reportTitle: 'Rush',
    projects: config.projects.map(project => ({
      name: `[${project.reviewCategory}] ${project.packageName}`,
      path: project.projectRelativeFolder.replace('packages/', '')
    }))
  }) as unknown as ReportBase
  htmlReport.execute(context)
}

collectCodeCoverage().then(console.log).catch(error => {
  console.error(error)
  process.exitCode = 1
})
