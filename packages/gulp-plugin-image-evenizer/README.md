# @hidoo/gulp-plugin-image-evenizer

> Plugin that evenize image for gulp.

## Installation

```sh
$ npm install --save-dev gulp@next @hidoo/gulp-plugin-image-evenizer
```

## Usage

```js
import {src, dest, task} from 'gulp';
import imageEvenizer from '@hidoo/gulp-plugin-image-evenizer';

task('evenize', () => src('/path/to/src')
  .pipe(imageEvenizer())
  .pipe(dest('/path/to/dest')));
```

## Supported formats

+ PNG
+ JPEG
+ GIF (Partical support)

  + Alpha GIF and Animated GIF are not support.

## Test

```sh
$ npm test
```

## License

MIT
