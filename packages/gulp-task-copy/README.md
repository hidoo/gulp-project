# @hidoo/gulp-task-copy

> Task that copy files for gulp.

## Installation

```sh
$ npm install --save-dev gulp@next @hidoo/gulp-task-copy
```

## Usage

```js
import {task} from 'gulp';
import {concatJs} from '@hidoo/gulp-task-copy';

task('copy', copy({
  src: '/path/to/src',
  dest: '/path/to/dest'
}));
```

## Test

```sh
$ npm test
```

## License

MIT
