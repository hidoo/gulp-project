/**
 * import modules
 */
import path from 'path';
import express from 'express';
import expressEngineHandlebars from '@hidoo/express-engine-handlebars';

/**
 * import modules - local
 */
import indexRouter from './routes';
import apiRouter from './routes/api';

// setup
const app = express();

// view settings
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', expressEngineHandlebars({
  layouts: path.resolve(__dirname, 'views/layouts/**/*.hbs'),
  partials: path.resolve(__dirname, 'views/partials/**/*.hbs'),
  helpers: path.resolve(__dirname, 'views/helpers/**/*.js')
}));

// registering routes
app.use('/', indexRouter);
app.use('/api', apiRouter);

export default app;
