import eslint from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettierrRecommended from 'eslint-plugin-prettier/recommended'
import noChinese from '@markof/eslint-plugin-no-chinese'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      eslint.configs.recommended,
      prettierrRecommended,
      noChinese.configs.recommended,
      ...tseslint.configs.recommended
    ],
    files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 2020
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ]
    }
  }
)
