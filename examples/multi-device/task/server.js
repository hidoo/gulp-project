import browserSync from 'browser-sync';
import * as config from '../config.js';
import app from '../src/server/app.js';

/**
 * return start local server task
 *
 * @return {Function<Promise>}
 */
const server = () =>
  new Promise((resolve, reject) => {
    const bs = browserSync.create('default'),
      { host, port, protocol, open, ui } = config.serverOptions;

    const options = {
      host,
      port,
      https: protocol === 'https',
      open,
      ui: ui ? { port: port + 1000 } : false, // eslint-disable-line no-magic-numbers
      server: {
        baseDir: config.path.dest,
        directory: true
      },
      startPath: '/README',
      middleware: [app]
    };

    bs.init(options, (error, instance) => {
      if (error) {
        reject(error);
      }
      resolve(instance);
    });

    bs.watch(`${config.path.dest}/**/*.{html,css,js,png,jpg,jpeg,gif,svg}`)
      .on('add', (filepath) => bs.reload(filepath))
      .on('change', (filepath) => bs.reload(filepath));
  });

export default server;
