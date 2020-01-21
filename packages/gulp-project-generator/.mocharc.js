module.exports = {
  'require': '@babel/register',
  'recursive': true,
  'ui': 'bdd',
  'slow': 0,
  'watch-ignore': [
    './node_modules',
    './.git',
    './test/fixtures/dest/**/*.js'
  ]
};
