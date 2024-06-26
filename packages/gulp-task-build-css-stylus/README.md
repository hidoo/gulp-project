# @hidoo/gulp-task-build-css-stylus

> Task that build css by stylus for gulp.

## Installation

```sh
$ npm install --save-dev gulp@next @hidoo/gulp-task-build-css-stylus
```

## Usage

basic:

```js
import { task } from 'gulp';
import buildCss from '@hidoo/gulp-task-build-css-stylus';

task(
  'css',
  buildCss({
    src: '/path/to/stylus/main.styl',
    dest: '/path/to/dest'
  })
);
```

remove unused CSS:

```js
import { task } from 'gulp';
import buildCss from '@hidoo/gulp-task-build-css-stylus';

task(
  'css',
  buildCss({
    src: '/path/to/stylus/main.styl',
    dest: '/path/to/dest',
    uncssTargets: ['/path/to/target.html']
  })
);
```

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### buildCss

return css build task by stylus

#### Parameters

- `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** options (optional, default `{}`)

  - `options.name` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** task name (use as displayName) (optional, default `'build:css'`)
  - `options.src` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** source path
  - `options.dest` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** destination path
  - `options.filename` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** destination filename (optional, default `'main.css'`)
  - `options.suffix` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** suffix when compressed (optional, default `'.min'`)
  - `options.browsers` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>?** target browsers.
    see: [default target browsers](http://browserl.ist/?q=%3E+0.5%25+in+JP%2C+ie%3E%3D+10%2C+android+%3E%3D+4.4)
  - `options.banner` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** license comments (optional, default `''`)
  - `options.stylusOptions` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** stylus options.
    see: [gulp-stylus options](https://www.npmjs.com/package/gulp-stylus) (optional, default `{rawDefine:{}}`)
  - `options.url` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** type of processing of url() (one of \[inline|copy|rebase])
    see: <https://www.npmjs.com/package/postcss-url> (optional, default `null`)
  - `options.urlOptions` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** options of processing of url()
    see: <https://www.npmjs.com/package/postcss-url#options-combinations> (optional, default `{}`)
  - `options.uncssTargets` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** array of html file path that target of uncss process (optional, default `[]`)
  - `options.uncssIgnore` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)<[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)>** array of selector that should not removed (optional, default `[]`)
  - `options.additionalProcess` **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)\<PostCSSRoot>** additional PostCss process (optional, default `null`)

#### Examples

```javascript
import { task } from 'gulp';
import buildCss from '@hidoo/gulp-task-build-css-stylus';

task(
  'css',
  buildCss({
    name: 'css:main',
    src: '/path/to/stylus/main.styl',
    dest: '/path/to/dest',
    filename: 'styles.css',
    suffix: '.hoge',
    browsers: ['> 0.1% in JP'],
    banner: '/*! copyright <%= pkg.author %> * /\n',
    stylusOptions: { rawDefine: {} },
    url: 'inline',
    urlOptions: { basePath: path.resolve(process.cwd(), 'src/images') },
    uncssTargets: ['/path/to/html/target.html'],
    uncssIgnore: ['.ignore-selector'],
    additionalProcess: (root) => root,
    compress: true
  })
);
```

Returns **[Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)<[Stream](https://nodejs.org/api/stream.html)>**&#x20;

## Test

```sh
$ pnpm test
```

## License

MIT
