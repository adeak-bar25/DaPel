import eslintPluginPrettier from 'eslint-plugin-prettier'

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    plugins: {
      prettier: eslintPluginPrettier
    },
    rules: {
      indent: ['error', 4],
      semi: ['error', 'always'],
      'no-unused-vars': 'warn',
      'prettier/prettier': ['error'],
    }
  }
]
