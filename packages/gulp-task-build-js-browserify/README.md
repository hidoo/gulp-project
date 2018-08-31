# @hidoo/gulp-task-build-js-browserify

> Task that build javascript by browserify for gulp.

## Installation

```sh
$ npm install --save-dev gulp@next @babel/{core,polyfill,preset-env} @hidoo/gulp-task-build-js-browserify
```

## Usage

```js
import {task} from 'gulp';
import buildJs from '@hidoo/gulp-task-build-js-browserify';

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
