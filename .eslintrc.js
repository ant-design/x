module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  ignorePatterns: ['.eslintrc.js', 'scripts/'],
  env: {
    browser: true,
    node: true,
    jasmine: true,
    jest: true,
    es6: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
    polyfills: ['Promise', 'URL'],
    'import/resolver': {
      typescript: {},
    },
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    'react',
    '@babel',
    'jest',
    '@typescript-eslint',
    'react-hooks',
    'unicorn',
    'markdown',
    'lodash',
  ],
  // https://github.com/typescript-eslint/typescript-eslint/issues/46#issuecomment-470486034
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-unused-vars': [2, { args: 'none' }],
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': 2,
        '@typescript-eslint/consistent-type-imports': [2, { disallowTypeAnnotations: false }],
        'import/consistent-type-specifier-style': 0,
        'default-case': 0,
      },
    },
    {
      // In v2, explicitly apply eslint-plugin-markdown's `markdown`
      // processor on any Markdown files you want to lint.
      files: ['components/*/demo/*.md'],
      processor: 'markdown/markdown',
    },
    {
      // In v2, configuration for fenced code blocks is separate from the
      // containing Markdown file. Each code block has a virtual filename
      // appended to the Markdown file's path.
      files: [
        'components/*/demo/*.md/*.ts',
        'components/*/demo/*.md/*.tsx',
        'components/*/demo/*.md/*.js',
        'components/*/demo/*.md/*.jsx',
      ],
      // Configuration for fenced code blocks goes with the override for
      // the code block's virtual filename, for example:
      parserOptions: {
        ecmaFeatures: {
          impliedStrict: true,
        },
      },
      globals: {
        React: true,
        ReactDOM: true,
        mountNode: true,
      },
      rules: {
        indent: 0,
        '@babel/new-cap': 0,
        '@babel/no-invalid-this': 0,
        '@babel/no-unused-expressions': 2,
        '@babel/object-curly-spacing': 0,
        '@babel/semi': 2,
        'default-case': 0,
        'eol-last': 0,
        'no-console': 0,
        'no-plusplus': 0,
        'no-script-url': 0,
        'prefer-rest-params': 0,
        'compat/compat': 0,
        'class-methods-use-this': 0,
        'react/no-access-state-in-setstate': 0,
        'react/destructuring-assignment': 0,
        'react/no-multi-comp': 0,
        'react/no-array-index-key': 0,
        'jsx-a11y/href-no-hash': 0,
        'jsx-a11y/control-has-associated-label': 0,
        'import/no-extraneous-dependencies': 0,
        'react/jsx-no-constructed-context-values': 0,
        'react/no-unstable-nested-components': 0,
      },
    },
    {
      files: ['components/**/demo/*.tsx'],
      rules: {
        'import/no-extraneous-dependencies': 0,
        'no-console': 0,
        'compat/compat': 0,
        'react/no-unstable-nested-components': 0,
        'jsx-a11y/control-has-associated-label': 0,
        'class-methods-use-this': 0,
        'react/no-access-state-in-setstate': 0,
      },
    },
    {
      files: ['.dumi/**/*.ts', '.dumi/**/*.tsx', '.dumi/**/*.js', '.dumi/**/*.jsx'],
      rules: {
        'import/no-extraneous-dependencies': 0,
        'no-console': 0,
        'compat/compat': 0,
        'react/no-unstable-nested-components': 0,
        'jsx-a11y/control-has-associated-label': 0,
        'class-methods-use-this': 0,
        'react/no-access-state-in-setstate': 0,
        'react/no-unknown-property': ['error', { ignore: ['css'] }],
        'react/no-array-index-key': 0,
        'react/button-has-type': 0,
        'react/no-danger': 0,
      },
    },
    {
      files: ['**/*.json'],
      rules: {
        'no-unused-expressions': 0,
        'comma-dangle': 0,
      },
    },
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx', '**/tests/**'],
      rules: {
        'compat/compat': 0,
        'import/no-extraneous-dependencies': 0,
      },
    },
  ],
  globals: {
    gtag: true,
  },
  rules: {
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/switch-exhaustiveness-check': 'off',
  },
};
