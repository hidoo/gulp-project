# @hidoo/gulp-util-error-handler

> Utility that handle task error for gulp.

## Installation

```sh
$ npm install --save-dev gulp@next gulp-plumber @hidoo/gulp-util-error-handler
```

## Usage

with [gulp-plumber](https://www.npmjs.com/package/gulp-plumber).

```js
import {src, dest, task} from 'gulp';
import plumber from 'gulp-plumber';
import errorHandler from '@hidoo/gulp-util-error-handler';

task('some', () => src('/path/to/src')
  .pipe(plumber({errorHandler}))
  .pipe(dest('/path/to/dest')));
```

## Test

```sh
$ pnpm test
```

## License

MIT
