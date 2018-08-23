import {grey, cyan, red} from 'chalk';
import log from 'fancy-log';

/**
 * Handling task error.
 * @param {Error} error Error Object
 * @return {void}
 *
 * @example
 * import {src, dest} from 'gulp';
 * import plumber from 'gulp-plumber';
 * import errorHandler from '@hidoo/gulp-project-util-error-handler';
 *
 * src('/path/to/src')
 *   .pipe(plumber({errorHandler}))
 *   .pipe(dest('/path/to/dest'));
 */
export default function errorHandler(error) {
  const {name, message, line, column, file, reason, plugin} = error,
        pluginInfo = plugin ? ` from '${cyan(plugin)}'` : '',
        fileInfo = line && column && file ? ` in ${file} at ${line}:${column}` : '',
        detail = `${reason || message}`;

  if (!name) {
    log.error(`${red('Error')}`);
    return;
  }

  log.error(`${red(name)}${pluginInfo}${grey(fileInfo)}${detail ? `, detail: ${grey(detail)}` : ''}`); // eslint-disable-line max-len
}
