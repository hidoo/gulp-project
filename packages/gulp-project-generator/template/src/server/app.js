import path from 'node:path';
import {fileURLToPath} from 'node:url';
import express from 'express';
import expressEngineHandlebars from '@hidoo/express-engine-handlebars';
import indexRouter from './routes/index.js';
import apiRouter from './routes/api.js';

// __dirname
const dirname = path.dirname(fileURLToPath(import.meta.url));

// setup
const app = express();

// view settings
app.set('views', path.resolve(dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', expressEngineHandlebars.default({
  layouts: path.resolve(dirname, 'views/layouts/**/*.hbs'),
  partials: path.resolve(dirname, 'views/partials/**/*.hbs'),
  helpers: path.resolve(dirname, 'views/helpers/**/*.js')
}));

// registering routes
app.use('/', indexRouter);
app.use('/api', apiRouter);

export default app;
