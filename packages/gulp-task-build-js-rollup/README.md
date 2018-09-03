# @hidoo/gulp-task-build-js-rollup

> Task that build javascript by rollup.js for gulp.

## Installation

```sh
$ npm install --save-dev gulp@next @babel/{core,polyfill,preset-env} @hidoo/gulp-task-build-js-rollup
```

## Usage

```js
import {task} from 'gulp';
import buildJs from '@hidoo/gulp-task-build-js-rollup';

task('js', buildJs({
  src: '/path/to/js/main.js',
  dest: '/path/to/dest'
}));
```

## Test

```sh
$ npm test
```

## License

MIT
