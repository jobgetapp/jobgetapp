# @jobgetapp/eslint-config

## Project Description

The base eslint configuration used for JobGet projects. Assumption that source code is stored with the following directory structure:

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

```
# src/.eslintrc.js
# test/.eslintrc.js

require('@jobgetapp/eslint-config')

module.exports = {
  root: true,
  extends: ['@jobgetapp/eslint-config'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  }
}
```