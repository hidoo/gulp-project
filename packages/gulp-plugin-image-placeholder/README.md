# @hidoo/gulp-plugin-image-placeholder

> Plugin that add image of placeholder for gulp.

## Installation

```sh
$ npm install --save-dev gulp@next @hidoo/gulp-plugin-image-placeholder
```

## Usage

```js
import { src, dest, task } from 'gulp';
import imagePlaceholder from '@hidoo/gulp-plugin-image-placeholder';

task('placeholder', () =>
  src('/path/to/src').pipe(imagePlaceholder()).pipe(dest('/path/to/dest'))
);
```

## Supported formats

- PNG
- JPEG
- GIF
- SVG

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### imagePlaceholder

return placeholder image.

#### Parameters

- `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** option (optional, default `{}`)

  - `options.append` **[Boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** append placeholder or not (optional, default `true`)
  - `options.suffix` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** placeholder image suffix (optional, default `'placeholder'`)
  - `options.verbose` **[Boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** out log or not (optional, default `false`)

#### Examples

```javascript
import { src, dest, task } from 'gulp';
import imagePlaceholder from '@hidoo/gulp-plugin-image-placeholder';

task('placeholder', () =>
  src('/path/to/src')
    .pipe(
      imagePlaceholder({
        append: false,
        suffix: 'placehold',
        verbose: true
      })
    )
    .pipe(dest('/path/to/dest'))
);
```

Returns **DestroyableTransform**&#x20;

## Test

```sh
$ pnpm test
```

## License

MIT
