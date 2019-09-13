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
        '**/*.spec.js',
        '**/*.test.js'
      ],
      'extends': [
        '@hidoo/eslint-config/+mocha'
      ]
    },
    // for Node
    {
      'files': [
        'src/server/**/*.js',
        'task/**/*.js',
        'gulpfile.babel.js'
      ],
      'extends': [
        '@hidoo/eslint-config/+node'
      ]
    }
  ]
};
