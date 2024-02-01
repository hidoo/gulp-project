# gulp-project

[![Status](https://github.com/hidoo/gulp-project/workflows/Main%20workflow/badge.svg)](https://github.com/hidoo/gulp-project/actions?query=branch%3Amaster)

> This is the monorepo for gulp project packages.

## Examples

+ [Single device project](./examples/single-device)
+ [Multi device project](./examples/multi-device)
+ [Sass project](./examples/use-sass)

These examples are generated by [@hidoo/gulp-project-generator](./packages/gulp-project.generator).     
You can generate a new gulp project interactively with the following command.

```sh
$ npx @hidoo/gulp-project-generator /path/to/my-new-project
```

## Packages

+ [@hidoo/gulp-plugin-image-evenizer](./packages/gulp-plugin-image-evenizer)
+ [@hidoo/gulp-plugin-image-placeholder](./packages/gulp-plugin-image-placeholder)
+ [@hidoo/gulp-plugin-svg-sprite](./packages/gulp-plugin-svg-sprite)
+ [@hidoo/gulp-plugin-webp](./packages/gulp-plugin-webp)
+ [@hidoo/gulp-project-generator](./packages/gulp-project-generator)
+ [@hidoo/gulp-task-build-css-sass](./packages/gulp-task-build-css-sass)
+ [@hidoo/gulp-task-build-css-stylus](./packages/gulp-task-build-css-stylus)
+ [@hidoo/gulp-task-build-html-handlebars](./packages/gulp-task-build-html-handlebars)
+ [@hidoo/gulp-task-build-js-browserify](./packages/gulp-task-build-js-browserify)
+ [@hidoo/gulp-task-build-js-rollup](./packages/gulp-task-build-js-rollup)
+ [@hidoo/gulp-task-build-sprite-image](./packages/gulp-task-build-sprite-image)
+ [@hidoo/gulp-task-build-sprite-svg](./packages/gulp-task-build-sprite-svg)
+ [@hidoo/gulp-task-build-styleguide-kss](./packages/gulp-task-build-styleguide-kss)
+ [@hidoo/gulp-task-concat](./packages/gulp-task-concat)
+ [@hidoo/gulp-task-copy](./packages/gulp-task-copy)
+ [@hidoo/gulp-task-optimize-image](./packages/gulp-task-optimize-image)
+ [@hidoo/gulp-util-error-handler](./packages/gulp-util-error-handler)
+ [@hidoo/util-fancy-print](./packages/util-fancy-print)
+ [@hidoo/util-local-ip](./packages/util-local-ip)
+ [@hidoo/util-merge-babelrc](./packages/util-merge-babelrc)

## Test

```sh
$ pnpm test
```

## License

MIT
