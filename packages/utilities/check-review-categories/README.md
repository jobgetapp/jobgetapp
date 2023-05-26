# @jobgetapp/check-review-categories

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
# common/config/jobgetapp/review-category-check.json

{
  "$schema": "@jobgetapp/check-review-categories/schemas/review-category-check.schema.json",
  "projects": [{
    "projectPathPattern": "packages\/libs\/.*",
    "reviewCategory": "public"
  }]
}
```

When the `@jobgetapp/check-review-categories` utility is ran, it will ensure that no project inside of `packages/libs` has is included in the `public` review category.

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
npm @jobgetapp/check-review-categories

Checking packages/libs/secret-code
Checking packages/deployments/web
Project [@jobgetapp/secret-code] is part of the restricted category [public] as matched by [packages\/libs\/.*]

Error: Found 1 projects in restricted review categories

The script failed with exit code 1
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
npm @jobgetapp/check-review-categories

Checking packages/libs/secret-code
Checking packages/deployments/web
```