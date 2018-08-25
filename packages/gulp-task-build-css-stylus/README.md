# @hidoo/gulp-task-build-css-stylus

> Task that build css by stylus for gulp.

## Installation

```sh
$ npm install --save-dev gulp@next @hidoo/gulp-task-build-css-stylus
```


## Usage

basic:

```js
import {task} from 'gulp';
import buildCss from '@hidoo/gulp-task-build-css-stylus';

task('css', buildCss({
  src: '/path/to/stylus/main.styl',
  dest: '/path/to/dest'
}));
```

remove unused CSS:

```js
import {task} from 'gulp';
import buildCss from '@hidoo/gulp-task-build-css-stylus';

task('css', buildCss({
  src: '/path/to/stylus/main.styl',
  dest: '/path/to/dest',
  uncssTargets: ['/path/to/target.html']
}));
```

## Test

```sh
$ npm test
```

## License

MIT
