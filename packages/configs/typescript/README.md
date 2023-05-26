# @jobgetapp/typescript-config

## Project Description

The base typescript configuration used for JobGet projects. Includes a both a source and test configuration, with the assumption that source code is stored with the following directory structure:

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
# src/tsconfig.json

{
  "extends": "@jobgetapp/typescript-config/tsconfig.lib.src.json",
  "compilerOptions": {
    "outDir": "../dist",
    "rootDir": ".",
    "baseUrl": "./",
    "paths": {
      "~/*": ["./*"]
    }
  }
}
```

```
# test/tsconfig.json

{
  "extends": "@jobgetapp/typescript-config/tsconfig.lib.test.json",
  "compilerOptions": {
    "rootDir": "..",
    "baseUrl": "../" 
  },
  "include": [
    "../src/**/*",
    "../test/**/*"
  ]
}
```