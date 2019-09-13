module.exports = {
  'root': true,
  'extends': [
    '@hidoo/eslint-config',
    '@hidoo/eslint-config/+babel'
  ],
  'overrides': [
    // for Mocha
    {
      'files': [
        '**/*.test.js'
      ],
      'extends': [
        '@hidoo/eslint-config/+mocha'
      ],
      'rules': {
        'no-sync': 'off',
        'newline-per-chained-call': 'off',
        'mocha/no-hooks-for-single-case': 'off'
      }
    },
    // for Node
    {
      'files': [
        '**/gulpfile.babel.js',
        '**/task/**/*.js',
        'packages/**/src/**/*.js',
        'scripts/**/*.js'
      ],
      'extends': [
        '@hidoo/eslint-config/+node'
      ],
      'rules': {
        'node/no-unpublished-import': 'off'
      }
    },
    // for template and fixture
    {
      'files': [
        'packages/**/template/**/*.js',
        'packages/**/test/fixtures/**/*.js'
      ],
      'rules': {
        'no-console': 'error',
        'import/no-unresolved': 'off',
        'node/no-extraneous-import': 'off'
      }
    }
  ]
};
