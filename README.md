<h1 align="center">
  JobGet Open Source
</h1>

<div align="center" style="padding-bottom: 2rem">
  <a href="https://github.com/nvm-sh/nvm">
    <img alt="Required NodeJS Version" src="https://img.shields.io/badge/node-%3E%3D14.15.0%20%3C15.0.0%20%7C%7C%20%3E%3D16.13.0%20%3C%2017.0.0-blue?style=for-the-badge">
  </a>
  <a href="https://rushjs.io/pages/intro/get_started/">
    <img alt="Required Rush Version" src="https://img.shields.io/badge/rush-%3E%3D5.56.0-blue?style=for-the-badge">
  </a>
</div>

Monorepo containing open-source projects at [JobGet](https://www.jobget.com/). View the Readmes of individual packages for more information.

## Package Types

| Name               | Description                                   |
|-----------|--------------------------------------------------------|
| configs   | Configurations for development tooling/libraries.      |
| rush-libs | Libraries contain utility plugins or scripts for rush. |

## Contributing

### Creating a pull request

Before submitting a pull request be sure to run `rush change`. This will walk you through all packages you have changes and prompt you to add a note for the change log. Once finished add and commit the newly created files in `common/changes`. These will be used by the CI pipeline to make changes to any deployed projects.
