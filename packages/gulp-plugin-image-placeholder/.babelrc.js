module.exports = {
  targets: {node: 10},
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
