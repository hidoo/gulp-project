module.exports = {
  targets: {node: 12},
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
