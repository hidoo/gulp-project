# @hidoo/gulp-task-build-sprite-image

> Task that build image sprite sheet for gulp.

## Installation

```sh
$ npm install --save-dev gulp@next @hidoo/gulp-task-build-sprite-image
```

## Usage

```js
import {task} from 'gulp';
import buildSprite from '@hidoo/gulp-task-build-sprite-image';

task('sprite', buildSprite({
  src: '/path/to/sprite/**/*.png',
  destImg: '/path/to/dest/image',
  destCss: '/path/to/dest/css',
  imgName: 'sprite.png',
  cssName: 'sprite.styl',
  imgPath: './image/sprite.png'
}));
```

## Test

```sh
$ npm test
```

## License

MIT
