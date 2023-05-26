import * as NodeFS from 'fs'
import * as NodePath from 'path'

import { config as dotEnvConfig, DotenvConfigOutput } from 'dotenv'

/**
 * Determines if the provided path is the root of a rushjs monorepo.
 * @param path - Input path
 * @param nodeFS - Node filesystem module
 */
const isRushRoot = (
  path: string,
  nodeFS: typeof NodeFS
): boolean => {
  return nodeFS
    .readdirSync(path)
    .filter(entity => entity === 'rush.json')
    .length === 1
}

/**
 * Determines if the provided path contains an .env file.
 * @param path - Input path
 * @param nodeFS - Node filesystem module
 */
const containsDotEnvFile = (
  path: string,
  nodeFS: typeof NodeFS
): boolean => {
  return nodeFS
    .readdirSync(path)
    .filter(entity => entity === '.env')
    .length === 1
}

/**
 * Get all env files from the provided path to the rushjs project root.
 * @param path - Input path
 * @param nodeFS - Node filesystem module
 * @param nodePath - Node path module
 */
const extractRushDotEnvDir = (
  path: string,
  nodeFS: typeof NodeFS,
  nodePath: typeof NodePath
): string[] => {
  const rushRoot = isRushRoot(path, nodeFS)
  const envFile = containsDotEnvFile(path, nodeFS)
  const parentPath = nodePath.resolve(path, '../')

  if (parentPath === path || rushRoot) {
    return envFile ? [path] : []
  }

  const parentEnvDirs = extractRushDotEnvDir(parentPath, nodeFS, nodePath)

  return envFile ? [...parentEnvDirs, path] : parentEnvDirs
}

/**
 * Gets the path to an env file based
 * on the provided rush environment variable
 * @param directory - Base directory to find the env file.
 * @param rushEnv - Environment specific file to look for.
 */
const getEnvFilePath = (
  directory: string,
  rushEnv?: string
): string => {
  const baseFile = `${directory}/.env`
  if (!rushEnv) {
    return baseFile
  }

  const rushEnvFile = `${baseFile}.${process.env.RUSHENV}`
  return NodeFS.existsSync(rushEnvFile)
    ? rushEnvFile
    : baseFile
}

/**
 * Runs dotenv for every .env file from the calling
 * process working directory up to the rushjs project root
 * @param nodeProcess - Calling process
 */
const rushenv = (
  nodeProcess: NodeJS.Process
): DotenvConfigOutput[] => extractRushDotEnvDir(nodeProcess.cwd(), NodeFS, NodePath)
  .map(directory => {
    return dotEnvConfig({
      path: getEnvFilePath(directory, nodeProcess.env.RUSHENV)
    })
  })

/**
 * Assuming the calling process is called from within a rushjs
 * project root, invoke dotenv on every .env file from the current
 * working directory of the calling process up to and including the
 * rush project root directory. This allows centralizing a .env file
 * with common values at each point in the monorepo hierarchy. It would
 * be expected that configuration files become more specific the closer
 * they become to any given calling process working directory.
 *
 * File are invoked in order starting from the process working directory.
 * The dotenv library does not overwrite variables, so this order ensures
 * the .env files closest to the process working directory take precedence.
 */
export const config = (): DotenvConfigOutput[] => rushenv(process)
