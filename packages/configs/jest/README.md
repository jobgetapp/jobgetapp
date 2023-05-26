# @jobgetapp/jest-config

## Project Description

The base jest configuration used for JobGet projects. Assumption that source code is stored with the following directory structure:

```
  .
  ├── ...
  ├── project_folder   # Folder containing the project content
  │   ├── package.json
  │   ├── jest.config.js
  │   ├── src
  │       ├── tsconfig.json
  │       ├── .eslintrc.js
  │       └── ...
  │   ├── test
  │       ├── tsconfig.json
  │       ├── .eslintrc.js
  │       └── ...
  └── ...
```

## Usage

This project also includes a custom reporter to handler issues where Jest writes reports to `stdErr`, causing rush to detect successful test cases as errors.

```
# jest.config.js

import type { Config } from '@jest/types'
import { JestConfig } from '@jobgetapp/jest-config'

export default async (): Promise<Config.InitialOptions> => {
  return {
    ...(await JestConfig()),
    coveragePathIgnorePatterns: [
      # Exclude files containing only typescript data
      # contracts from coverage output
      "/contracts/"
    ],
  }
}
```