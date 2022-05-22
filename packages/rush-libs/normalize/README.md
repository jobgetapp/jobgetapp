# @jobgetapp/rush-normalize

This is a script that will use the rush version manager to find packages with mismatching versions, and update all consumers of these packages to the latest version supported by the rush repository. This is useful when a rush repository contains many interconnected projects being worked on by multiple developers. After a release, developers can run this script after pulling in their latest upstream changes.

## Example

```
> rush update


Rush Multi-Project Build Tool 5.56.0 - https://rushjs.io
Node.js version is 14.18.1 (LTS)


Starting "rush update"

@jobgetapp/eslint-config
  1.0.1
   - @jobgetapp/jest-config
  1.0.0
   - @jobgetapp/rush-normalize

Found 1 mis-matching dependencies!

> npx @jobgetapp/rush-normalize

Setting @jobgetapp/eslint-config in @jobgetapp/rush-normalize to version 1.0.1
```

