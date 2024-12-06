# @jobgetapp/rush-enforce-categories-plugin

## Project description

This is a script that ensures public or externally facing projects do not leak code from private projects. Consider the following

```
#rush.json

...
{
  "packageName": "@jobgetapp/secret-code",
  "projectFolder": "packages/libs/secret-code",
  "reviewCategory": "private",
  "versionPolicyName": "packable"
},
{
  "packageName": "@jobgetapp/public-site",
  "projectFolder": "packages/deployments/web",
  "reviewCategory": "public",
  "versionPolicyName": "packable"
},
...
```

We would want to ensure that nowhere in the dependency tree of `@jobgetapp/public-site` is `@jobgetapp/secret-code`, as tree shaking may not remove code containing private intellectual property. To do this we rely on the rush approved packages system, and using the following configuration.

```
# common/config/rush-plugins/enforce-categories.json

{
  "categoryRestrictions": [{
    "category": "private",
    "forbiddenCategories": ["public"]
  }]
}
```

When the `rush enforce-categories` utility is ran, it will ensure that no project with the `private` review category shows up inside `browser-approved-packages.json` with `allowedCategories` containing `public`.

## Usage

### Failing Example

```
# browser-approved-packages.json

{
  "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/approved-packages.schema.json",
  "packages": [
    {
      "name": "@jobgetapp/secret-code",
      "allowedCategories": [ "private", "public" ]
    },
    {
      "name": "@jobgetapp/public-site",
      "allowedCategories": [ "public" ]
    },
    ...
  ]
```

```
rush enforce-categories

@jobgetapp/secret-code is restricted by category: public

Found 1 category errors
```

### Passing Example

```
# browser-approved-packages.json

{
  "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/approved-packages.schema.json",
  "packages": [
    {
      "name": "@jobgetapp/secret-code",
      "allowedCategories": [ "private" ]
    },
    {
      "name": "@jobgetapp/public-site",
      "allowedCategories": [ "public" ]
    },
    ...
  ]
```

```
rush enforce-categories
```