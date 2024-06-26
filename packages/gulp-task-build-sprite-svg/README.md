# @hidoo/gulp-task-build-sprite-svg

> Task that build svg sprite sheet for gulp.

## Installation

```sh
$ npm install --save-dev gulp@next @hidoo/gulp-task-build-sprite-svg
```

## Usage

```js
import { task } from 'gulp';
import buildSprite from '@hidoo/gulp-task-build-sprite-svg';

task(
  'sprite',
  buildSprite({
    src: '/path/to/sprite/*.svg',
    destImg: '/path/to/dest/image',
    destCss: '/path/to/dest/css',
    imgName: 'sprite.svg',
    cssName: 'sprite.styl',
    imgPath: './image/sprite.svg'
  })
);
```

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### svgo

### buildSprite

return build svg sprite sheet task

#### Parameters

- `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** option (optional, default `{}`)

  - `options.name` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** task name (use as displayName) (optional, default `'build:sprite'`)
  - `options.src` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** source path
  - `options.destImg` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** destination image path
  - `options.destCss` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** destination css path
  - `options.imgName` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** destination image filename
  - `options.cssName` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** destination css filename
  - `options.imgPath` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** destination image path in css
  - `options.padding` **[Number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** padding between image in sprite sheet (optional, default `2`)
  - `options.layout` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** layout for generate sprite sheet（one of \[packed|vertical|horizontal]） (optional, default `'packed'`)
  - `options.cssPreprocessor` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** type of css preprocessor (one of \[stylus|sass|sass:module]). (optional, default `'stylus'`)
  - `options.cssTemplate` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Handlebars template for css.
    `options.cssPreprocessor` is ignored if this value is specified.
    see: [default template](./template/stylus.hbs) (optional, default `path.resolve(__dirname,'../template/stylus.hbs')`)
  - `options.cssHandlebarsHelpers` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Handlebars helpers (optional, default `require('@hidoo/handlebars-helpers')`)
  - `options.verbose` **[Boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** out log or not (optional, default `false`)

#### Examples

```javascript
import {task} from 'gulp';
import buildSprite, {svgo} from '@hidoo/gulp-task-build-sprite-svg';

task('sprite', buildSprite({
  name: 'sprite:main',
  src: '/path/to/sprite/*.svg',
  destImg: '/path/to/dest/image',
  destCss: '/path/to/dest/css',
  imgName: 'sprite.svg',
  cssName: 'sprite.styl',
  imgPath: './path/from/css/to/sprite/sprite.svg',
  padding: 10,
  layout: 'vertical',
  cssPreprocessor: 'sass',
  cssTemplate: '/path/to/template/sass.hbs',
  cssHandlebarsHelpers: {hoge: (value) => value},
  compress: {
    imagemin: [svgo())]
  },
  verbose: true
}));
```

Returns **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)<[Stream](https://nodejs.org/api/stream.html)>**&#x20;

## Test

```sh
$ pnpm test
```

## License

MIT
