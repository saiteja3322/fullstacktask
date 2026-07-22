export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  {
    files: ['src/**/*.{js,jsx}'],
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
];
