# @hidoo/util-merge-babelrc

> Utility that merging .babelrc.

## Installation

```sh
$ npm install --save-dev @hidoo/util-merge-babelrc
```

## Usage

```js
import mergeBabelrc from '@hidoo/util-merge-babelrc';

const babelOptions = mergeBabelrc('/path/to/.babelrc.js', {
  presets: [...],
  plugins: [...],
  useBuiltIns: 'usege'
});
```

## Test

```sh
$ npm test
```

## License

MIT
