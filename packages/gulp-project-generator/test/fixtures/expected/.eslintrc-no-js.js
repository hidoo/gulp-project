module.exports = {
  'root': true,
  'extends': [
    '@hidoo/eslint-config'
  ],
  'overrides': [
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
