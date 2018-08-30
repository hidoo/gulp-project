# @hidoo/gulp-task-build-sprite-image

> Task that build image sprite sheet for gulp.

## Installation

```sh
$ npm install --save-dev gulp@next @hidoo/gulp-task-build-sprite-image
```

### ImageMagick or GraphicsMagick

for example macOS

```sh
$ brew install imagemagick
```

or

```sh
$ brew install graphicsmagick
```

## Usage

```js
import {task} from 'gulp';
import buildSprite from '@hidoo/gulp-task-build-sprite-image';

task('sprite', buildSprite({
  src: '/path/to/sprite/*.png',
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
