/* eslint max-len: off, no-magic-numbers: off, no-process-env: off, prefer-named-capture-group: off */

/**
 * import modules
 */
import {Command} from 'commander';
import ips from '@hidoo/util-local-ip';

/**
 * adjust NODE_ENV
 * + It use 'development', when process.env.NODE_ENV is not valid value.
 * + Otherwise use the value of process.env.NODE_ENV as it is.
 */
if (typeof process.env.NODE_ENV !== 'string' || process.env.NODE_ENV === '') {
  process.env.NODE_ENV = 'development';
}

/**
 * parse cli options
 *
 * @type {Command}
 */
const cli = new Command()
  .option('--host <ip>', 'set ip.')
  .option('--port <number>', 'set port.')
  .option('--protocol <scheme>', 'set protocol.')
  .option('--open [type]', 'open browser automatically or not.')
  .option('--ui', 'enable debug ui or not.')
  .option('--compress', 'enable file compress or not.')
  .parse(process.argv);

/**
 * dev server options
 *
 * @type {Object}
 */
export const serverOptions = {
  host: String(cli.host || process.env.SERVER_HOST || ips({ipv6: false, internal: false})[0]) || '0.0.0.0',
  port: Number(cli.port || process.env.SERVER_PORT) || 8000,
  protocol: String(cli.protocol || process.env.SERVER_PROTOCOL || 'http'),
  open: cli.open || process.env.SERVER_OPEN || false,
  ui: Boolean(cli.ui || process.env.SERVER_UI) || false
};

/**
 * compress flag
 * + It is true, when process.env.NODE_ENV is not 'development'.
 *
 * @type {Boolean}
 */
export const compress = cli.compress || process.env.NODE_ENV !== 'development' || false;

/**
 * package.json
 *
 * @type {Object}
 */
export {default as pkg} from './package.json';

/**
 * path settings
 *
 * @type {Object}
 */
export const path = {

  // base
  src: './src',
  dest: './public',

  // source details
  get srcCss() { return `${this.src}/css`; },
  get srcData() { return `${this.src}/data`; },
  get srcHtml() { return `${this.src}/html`; },
  get srcImage() { return `${this.src}/image`; },
  get srcJs() { return `${this.src}/js`; },
  get srcSprite() { return `${this.src}/sprite`; },
  get srcStyleguide() { return `${this.dest}/css`; },

  // destinaion details
  get destCss() { return `${this.dest}/css`; },
  get destHtml() { return this.dest; },
  get destImage() { return `${this.dest}/images`; },
  get destJs() { return `${this.dest}/js`; },
  get destSprite() { return `${this.dest}/images/sprites`; },
  get destStyleguide() { return `${this.dest}/styleguide`; }
};
