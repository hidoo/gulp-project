# @hidoo/gulp-project-generator

> Command line tool that generate gulp project scaffold.

## Installation

```sh
$ npm install --save-dev @hidoo/gulp-project-generator
```

## Usage

```sh
$ gulp-project-generator my-new-project
```

### Options

```
Usage: gulp-project-generator <dir> [options]

Options:

  -v, --version           output the version number
  --name <name>           set project name.
  --no-interactive        Disable interactive interface.
  --no-css                Disable CSS build task.
  --no-css-deps           Disable CSS dependency build task.
  --no-html               Disable HTML build task.
  --no-image              Disable image optimize task.
  --no-js                 Disable JavaScript build task.
  --no-js-deps            Disable JavaScript dependency build task.
  --no-server             Disable local dev server.
  --no-sprite             Disable sprite sheet build task. (Enable forcely when --no-css specified.)
  --no-styleguide         Disable styleguide build task. (Enable forcely when --no-css specified.)
  --js-bundler [bundler]  Select JavaScript bundler. [browserify|rollup] (default: browserify)
  --sprite-type [type]    Select sprite sheet source type. [svg|image] (default: svg)
  --verbose               Enable output logs.
  -h, --help              output usage information
```

## Test

```sh
$ npm test
```

## License

MIT
