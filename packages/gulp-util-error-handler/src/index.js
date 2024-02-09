import util from 'node:util';
import chalk from 'chalk';
import log from 'fancy-log';

// tweaks log date color like gulp log
util.inspect.styles.date = 'grey';

/**
 * Handling task error.
 *
 * @param {Error} error Error Object
 * @return {void}
 *
 * @example
 * import {src, dest, task} from 'gulp';
 * import plumber from 'gulp-plumber';
 * import errorHandler from '@hidoo/gulp-util-error-handler';
 *
 * task('some', () => src('/path/to/src')
 *   .pipe(plumber({errorHandler}))
 *   .pipe(dest('/path/to/dest')));
 */
export default function errorHandler(error) {
  const { name, message, line, column, file, reason, plugin } = error,
    pluginInfo = plugin ? ` from '${chalk.cyan(plugin)}'` : '',
    fileInfo = line && column && file ? ` in ${file} at ${line}:${column}` : '',
    detail = `${reason || message}`;

  if (!name) {
    log.error(`${chalk.red('Error')}`);
    return;
  }

  log.error(
    `${chalk.red(name)}${pluginInfo}${chalk.grey(fileInfo)}${detail ? `, detail: ${chalk.grey(detail)}` : ''}`
  );
}
