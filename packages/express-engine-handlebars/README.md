# @hidoo/express-engine-handlebars

> Handlebars template engine for express.

## Installation

```sh
$ npm install --save express @hidoo/express-engine-handlebars
```

## Usage

```js
import express from 'express';
import expressEngineHandlebars from '@hidoo/express-engine-handlebars';

const app = express();

app.set('view engine', 'hbs');
app.set('views', '/path/to/views');
app.engine('hbs', expressEngineHandlebars({
  layouts: '/path/to/views/layouts/**/*.hbs',
  partials: '/path/to/views/partials/**/*.hbs',
  helpers: '/path/to/views/helpers/**/*.js'
}));
```

### Registering Helpers

example:

```js
export const register = (handlebars) => {
  handlebars.registerHelper('wrapBrackets', (value) =>
    new handlebars.SafeString(`[[ ${value} ]]`)
  );
};
```

## Test

```sh
$ npm test
```

## License

MIT
