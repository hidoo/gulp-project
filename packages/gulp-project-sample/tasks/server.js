/**
 * import modules
 */
import browserSync from 'browser-sync';

/**
 * import modules - local
 */
import {serverOptions, path} from '../config';
import app from '../src/server/app';

/**
 * return start local server task
 * @return {Function<Promise>}
 */
const server = () => new Promise((resolve, reject) => {
  const bs = browserSync.create('default'),
        {host, port, protocol, open, ui} = serverOptions;

  const options = {
    host,
    port,
    https: protocol === 'https',
    open,
    ui: ui ? {port: port + 1000} : false, // eslint-disable-line no-magic-numbers
    server: {
      baseDir: path.dest,
      directory: true
    },
    startPath: '/README',
    middleware: [app],
    files: [`${path.dest}/**/*.{html,css,js,png,jpg,jpeg,gif,svg}`],
    reloadDebounce: 1000
  };

  bs.init(options, (error, instance) => {
    if (error) {
      reject(error);
    }
    resolve(instance);
  });
});

export default server;
