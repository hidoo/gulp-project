module.exports = {
  targets: {node: 'current'},
  presets: [
    ['@babel/preset-env']
  ],
  env: {
    test: {
      presets: [
        'power-assert'
      ]
    }
  }
};
