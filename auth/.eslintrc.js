module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['airbnb-typescript-prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
    'import/prefer-default-export': 'off',
  },
};
