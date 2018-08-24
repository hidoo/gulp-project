# @hidoo/gulp-task-optimize-image

> Task that optimize image for gulp.

## Installation

```sh
$ npm install --save-dev gulp@next @hidoo/gulp-task-optimize-image
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
import optimizeImage from '@hidoo/gulp-task-optimize-image';

task('image', optimizeImage({
  src: '/path/to/images/*.{jpg,jpeg,gif,png,svg,ico}',
  dest: '/path/to/dest'
}));
```

## Test

```sh
$ npm test
```

## License

MIT
