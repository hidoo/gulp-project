# @hidoo/gulp-plugin-image-evenizer

> Plugin that evenize image for gulp.

## Installation

```sh
$ npm install --save-dev gulp@next @hidoo/gulp-plugin-image-evenizer
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
import {src, dest, task} from 'gulp';
import imageEvenizer from '@hidoo/gulp-plugin-image-evenizer';

task('evenize', () => src('/path/to/src')
  .pipe(imageEvenizer())
  .pipe(dest('/path/to/dest')));
```

## Test

```sh
$ npm test
```

## License

MIT
