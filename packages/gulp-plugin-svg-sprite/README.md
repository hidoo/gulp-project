# @hidoo/gulp-plugin-svg-sprite

> Plugin that build svg sprite sheet for gulp.

## Installation

minimal:

```sh
$ npm install --save-dev gulp@next @hidoo/gulp-plugin-svg-sprite
```

recommended:

```sh
$ npm install --save-dev merge-stream gulp@next @hidoo/gulp-plugin-svg-sprite
```

## Usage

```js
import {src, dest, task} from 'gulp';
import merge from 'merge-stream';
import svgSprite from '@hidoo/gulp-plugin-svg-sprite';

task('sprite', () => {
  const stream = src('/path/to/src')
    .pipe(svgSprite(options));

  return merge(
    stream.css.pipe(dest('/path/to/dest')),
    stream.svg.pipe(dest('/path/to/dest'))
  );
};
```

## Test

```sh
$ yarn test
```

## License

MIT
