# hoge-project

> A project scaffold using [gulp](http://gulpjs.com/).

## Dependencies

+ [Node.js](https://nodejs.org/) (8.0.0+)
+ [ImageMagick](http://www.imagemagick.org/)

## Installation

```sh
$ npm install
```

## Usage

### For development

```sh
# run build tasks and watch files
$ npm start

# same as `npm start`
$ npm run dev

# run build tasks only
$ npm run dev:build
```

#### Command line options

```sh
--host <ip>             set ip. (default: 0.0.0.0)
--port <number>         set port. (default: 8000)
--protocol <scheme>     set protocol. [https|http] (default: http)
--open [type]           open browser automatically. [true|local|external|ui|ui-external|false]
--ui                    enable debug ui or not.
--compress              enable file compress or not.
```

example:

```sh
$ npm run dev -- --compress
```

### For production

```sh
# run build tasks and watch files
$ npm run prod

# run build tasks only
$ npm run prod:build
```

### For testing

```sh
# run all testing
$ npm test
```
