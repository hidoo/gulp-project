# @hidoo/gulp-task-build-css-sass

> Task that build css by sass for gulp.

## Installation

```sh
$ npm install --save-dev gulp @hidoo/gulp-task-build-css-sass
```

## Usage

basic:

```js
import {task} from 'gulp';
import buildCss from '@hidoo/gulp-task-build-css-sass';

task('css', buildCss({
  src: '/path/to/scss/main.scss',
  dest: '/path/to/dest'
}));
```

remove unused CSS:

```js
import {task} from 'gulp';
import buildCss from '@hidoo/gulp-task-build-css-scss';

task('css', buildCss({
  src: '/path/to/scss/main.scss',
  dest: '/path/to/dest',
  uncssTargets: ['/path/to/target.html']
}));
```

## API


## Test

```sh
$ npm test
```

## License

MIT
