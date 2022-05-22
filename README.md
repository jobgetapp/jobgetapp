# JobGetApp

Monorepo containing open-source projects at [JobGet](https://www.jobget.com/). View the Readmes of individual packages for more information.

## Package Types

| Name               | Description                                   |
|-----------|--------------------------------------------------------|
| configs   | Configurations for development tooling/libraries.      |
| rush-libs | Libraries contain utility plugins or scripts for rush. |

## Contributing

### Creating a pull request

Before submitting a pull request be sure to run `rush change`. This will walk you through all packages you have changes and prompt you to add a note for the change log. Once finished add and commit the newly created files in `common/changes`. These will be used by the CI pipeline to make changes to any deployed projects.
