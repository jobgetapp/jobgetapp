require('@jobgetapp/eslint-config')

module.exports = {
  root: true,
  extends: ['@jobgetapp/eslint-config'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  }
}