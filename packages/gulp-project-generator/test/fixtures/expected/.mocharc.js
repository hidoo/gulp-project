module.exports = {
  require: [
    '@babel/register',
    'core-js',
    'jsdom-global/register'
  ],
  recursive: true,
  ui: 'bdd',
  slow: 0
};
