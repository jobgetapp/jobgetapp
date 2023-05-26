# @jobgetapp/rushenv

## Project description

A wrapper around [dotenv](https://github.com/motdotla/dotenv) which recursively looks up from a rush project until it finds the rush project root.

```
  .
  ├── rush.json
  ├── .env
  ├── .env.prod
  ├── packages
  │   ├── project_folder
  │       ├── package.json
  │       ├── jest.config.js
  │       ├── src
  │           ├── .env
  │           ├── index.ts
  │           └── ...
  └── ...
```

In the above example the `.env` file in the root of the rush repo will be loaded first, then the `packages/project_folder/src.env` file will be loaded after.

Environment files following the format `.env.${ENV_TYPE}` can be loaded by setting a `RUSHENV` environment variable. For example starting the project with `RUSH_ENV=prod` will first load the `.env.prod` file in the rush repo root, then since no environment file with the extensions `prod` exists in the project folder, the `packages/project_folder/src.env` will be loaded. As a caveat, a `.env.${ENV_TYPE}` will never be loaded unless it exists along side a `.env` file.

## Usage

```
# src/index.ts

import { config } from '@jobgetapp/rushenv'

config()
```

```
# Run project with .env configuration
npm run start

# Run project with .env.prod configuration
RUSHENV=prod npm run start
```