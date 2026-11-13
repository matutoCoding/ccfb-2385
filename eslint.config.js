import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'

// 引擎层与状态层物理隔离：engine 禁引 vue/pinia，stores 禁引 three
export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    files: ['src/engine/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', { paths: ['vue', 'pinia'] }],
    },
  },
  {
    files: ['src/stores/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', { paths: ['three', '@/engine'] }],
    },
  },
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
)
