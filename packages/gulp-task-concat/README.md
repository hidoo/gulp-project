# @hidoo/gulp-task-concat

> Task that concat files for gulp.

## Installation

```sh
$ npm install --save-dev gulp@next @hidoo/gulp-task-concat
```

## Usage

for JavaScript:

```js
import {task} from 'gulp';
import {concatJs} from '@hidoo/gulp-task-concat';

task('concat:js', concatJs({
  src: [
    '/path/to/js/a.js'
    '/path/to/js/b.js'
    '/path/to/js/c.js'
  ],
  dest: '/path/to/dest'
}));
```

for CSS:

```js
import {task} from 'gulp';
import {concatCss} from '@hidoo/gulp-task-concat';

task('concat:css', concatCss({
  src: [
    '/path/to/css/a.css'
    '/path/to/css/b.css'
    '/path/to/css/c.css'
  ],
  dest: '/path/to/dest'
}));
```

## Test

```sh
$ npm test
```

## License

MIT
