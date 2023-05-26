// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  // root: true,
  // extends: [ '@rushstack/eslint-config/profile/node' ],
  parserOptions: {
    extraFileExtensions: ['.vue']
  },
  overrides: [
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      rules: {}
    },
    {
      files: ['*.ts', '*.tsx', '*.vue'],
      extends: [
        '@nuxtjs/eslint-config-typescript'
      ],
      plugins: [
        'eslint-plugin-tsdoc'
      ],
      rules: {
        "tsdoc/syntax": "error",
        /*
        "require-jsdoc": ["error", {
          "require": {
            "FunctionDeclaration": true,
            "MethodDefinition": true,
            "ClassDeclaration": true,
            "ArrowFunctionExpression": true,
            "FunctionExpression": true
          }
        }],
        */
        // https://github.com/Chatie/eslint-config/issues/45
        'no-void': ['error', { allowAsStatement: true }],
        'no-undef': 'off',
        'max-len': ['error', { code: 120, ignoreUrls: true }],
        // This rule is cool, but like sql man.
        'camelcase': 'off',
        // Typescript breaks this rule sometimes, but has no fix rule :/
        'arrow-parens': 'off',
        // ESLint -> Typescript
        'no-useless-constructor': 'off',
        '@typescript-eslint/no-useless-constructor': 'error',
        'no-redeclare': 'off',
        '@typescript-eslint/no-redeclare': ['error'],
        'no-dupe-class-members': 'off',
        '@typescript-eslint/no-dupe-class-members': ['error'],
        // Typescript
        '@typescript-eslint/array-type': 'error',
        '@typescript-eslint/await-thenable': 'error',
        '@typescript-eslint/prefer-readonly': 'error',
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-this-alias': 'error',
        '@typescript-eslint/explicit-member-accessibility': 'error',
        '@typescript-eslint/explicit-function-return-type': ['error'],
        '@typescript-eslint/member-delimiter-style': ['error', {
          multiline: {
            delimiter: 'none',
            requireLast: true
          },
          singleline: {
              delimiter: 'comma',
              requireLast: false
          },
          multilineDetection: 'brackets'
        }],
        // STANDARDIZED BY:   @typescript-eslint\eslint-plugin\dist\configs\recommended.json
        //
        // CONFIGURATION:     By default, these are banned: String, Boolean, Number, Object, Symbol
        '@typescript-eslint/ban-types': [
          'error',
          {
            extendDefaults: false, // (the complete list is in this file)
            types: {
              String: {
                message: 'Use "string" instead',
                fixWith: 'string'
              },
              Boolean: {
                message: 'Use "boolean" instead',
                fixWith: 'boolean'
              },
              Number: {
                message: 'Use "number" instead',
                fixWith: 'number'
              },
              Object: {
                message: 'Use "object" instead, or else define a proper TypeScript type:'
              },
              Symbol: {
                message: 'Use "symbol" instead',
                fixWith: 'symbol'
              },
              Function: {
                message: [
                  'The "Function" type accepts any function-like value.',
                  'It provides no type safety when calling the function, which can be a common source of bugs.',
                  'It also accepts things like class declarations, which will throw at runtime as they will not be called with "new".',
                  'If you are expecting the function to accept certain arguments, you should explicitly define the function shape.'
                ].join('\n')
              }

              // This is a good idea, but before enabling it we need to put some thought into the recommended
              // coding practices; the default suggestions are too vague.
              //
              // '{}': {
              //   message: [
              //     '"{}" actually means "any non-nullish value".',
              //     '- If you want a type meaning "any object", you probably want "Record<string, unknown>" instead.',
              //     '- If you want a type meaning "any value", you probably want "unknown" instead.'
              //   ].join('\n')
              // }
            }
          }
        ],
        // Import
        'import/no-cycle': 'error',
        'import/order': [
          'error', {
            alphabetize: {
              order: 'asc'
            },
            'newlines-between': 'always',
            groups: [
              'builtin',
              'external',
              'index',
              'sibling',
              'parent' ,
              'internal'
            ]
          }
        ]
      }
    }
  ]
};