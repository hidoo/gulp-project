# @hidoo/gulp-task-build-sprite-svg

> Task that build svg sprite sheet for gulp.

## Installation

```sh
$ npm install --save-dev gulp@next @hidoo/gulp-task-build-sprite-svg
```

## Usage

```js
import {task} from 'gulp';
import buildSprite from '@hidoo/gulp-task-build-sprite-svg';

task('sprite', buildSprite({
  src: '/path/to/sprite/*.svg',
  destImg: '/path/to/dest/image',
  destCss: '/path/to/dest/css',
  imgName: 'sprite.svg',
  cssName: 'sprite.styl',
  imgPath: './image/sprite.svg'
}));
```

## Test

```sh
$ npm test
```

## License

MIT
