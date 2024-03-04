module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    "plugin:valtio/recommended",
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'prettier'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true }
    ],
    "valtio/state-snapshot-rule": "warn",
    "valtio/avoid-this-in-proxy" :"warn",
    '@typescript-eslint/no-explicit-any': 'warn',
    'prettier/prettier': 'error'
  },
}
