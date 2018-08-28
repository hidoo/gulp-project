# @hidoo/gulp-task-build-html-handlebars

> Task that build html by handlebars for gulp.

## Installation

```sh
$ npm install --save-dev gulp@next @hidoo/gulp-task-build-html-handlebars
```

## Usage

```js
import {task} from 'gulp';
import buildHtml from '@hidoo/gulp-task-build-html-handlebars';

task('html', buildHtml({
  src: '/path/to/html/*.hbs',
  dest: '/path/to/dest'
}));
```

## Test

```sh
$ npm test
```

## License

MIT
