module.exports = {
    env: {
        es2021: true,
        node: true,
    },
    extends: ['standard-with-typescript', 'prettier'],
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
    },
    rules: {
        'no-console': 'warn',
        'no-await-in-loop': 'error',
        'no-inline-comments': 'warn',
        'space-before-function-paren': 0,
        '@typescript-eslint/semi': 0,
        '@typescript-eslint/consistent-type-imports': 0,
        '@typescript-eslint/consistent-type-assertions': 0,
        '@typescript-eslint/strict-boolean-expressions': 0,
        '@typescript-eslint/no-misused-promises': 0,
        '@typescript-eslint/no-extraneous-class': 0,
        '@typescript-eslint/space-before-function-paren': 0,
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/return-await': 0,
    },
};
