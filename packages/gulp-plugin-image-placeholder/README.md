# @hidoo/gulp-plugin-image-placeholder

> Plugin that add image of placeholder for gulp.

## Installation

```sh
$ npm install --save-dev gulp@next @hidoo/gulp-plugin-image-placeholder
```

## Usage

```js
import {src, dest, task} from 'gulp';
import imagePlaceholder from '@hidoo/gulp-plugin-image-placeholder';

task('placeholder', () => src('/path/to/src')
  .pipe(imagePlaceholder())
  .pipe(dest('/path/to/dest')));
```

## Supported formats

+ PNG
+ JPEG
+ GIF
+ SVG

## Test

```sh
$ npm test
```

## License

MIT
