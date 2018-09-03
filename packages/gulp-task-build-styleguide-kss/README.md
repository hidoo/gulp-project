# @hidoo/gulp-task-build-styleguide-kss

> Task that build styleguide by kss for gulp.

## Installation

```sh
$ npm install --save-dev gulp@next @hidoo/gulp-task-build-styleguide-kss
```

## Usage

```js
import {task} from 'gulp';
import buildStyleguide from '@hidoo/gulp-task-build-styleguide-kss';

task('styleguide', buildStyleguide({
  src: '/path/to/css',
  dest: '/path/to/dest'
}));
```

## Test

```sh
$ npm test
```

## License

MIT
