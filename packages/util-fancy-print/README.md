# @hidoo/util-fancy-print

> Utility that print styled values to console.

## Installation

```sh
$ npm install @hidoo/util-fancy-print
```

## Usage

```js
import fancyPrint from '@hidoo/util-fancy-print';

fancyPrint('project name', [
  {label: 'Host', value: '0.0.0.0'},
  {label: 'Port', value: 8000}
]);
// ++++++++++++++++++++++++++++++
//          project name
// ++++++++++++++++++++++++++++++
//
// Host: 0.0.0.0
// Port: 8000
//
// ++++++++++++++++++++++++++++++
```

## Test

```sh
$ yarn test
```

## License

MIT
