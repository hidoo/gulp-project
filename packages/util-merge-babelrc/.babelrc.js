module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {node: 8}
    }]
  ],
  env: {
    test: {
      presets: [
        'power-assert'
      ]
    }
  }
};
