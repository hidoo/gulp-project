/* eslint no-magic-numbers: off, prefer-named-capture-group: off */

import fs from 'node:fs/promises';
import { Command } from 'commander';

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
 * cli option values
 *
 * @return {Object}
 */
const opts = cli.opts();

/**
 * dev server options
 *
 * @type {Object}
 */
export const serverOptions = {
  host: opts.host || process.env.SERVER_HOST,
  port: Number(opts.port || process.env.SERVER_PORT) || 8000,
  protocol: String(opts.protocol || process.env.SERVER_PROTOCOL || 'http'),
  open: opts.open || process.env.SERVER_OPEN || false,
  ui: Boolean(opts.ui || process.env.SERVER_UI) || false
};

/**
 * compress flag
 * + It is true, when process.env.NODE_ENV is not 'development'.
 *
 * @type {Boolean}
 */
export const compress =
  opts.compress || process.env.NODE_ENV !== 'development' || false;

/**
 * package.json
 *
 * @type {Object}
 */
export const pkg = JSON.parse(await fs.readFile('./package.json'));

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
  get srcCss() {
    return `${this.src}/css`;
  },
  get srcData() {
    return `${this.src}/data`;
  },
  get srcHtml() {
    return `${this.src}/html`;
  },
  get srcImage() {
    return `${this.src}/image`;
  },
  get srcJs() {
    return `${this.src}/js`;
  },
  get srcSprite() {
    return `${this.src}/sprite`;
  },
  get srcStyleguide() {
    return `${this.dest}/css`;
  },

  // destinaion details
  get destCss() {
    return `${this.dest}/css`;
  },
  get destHtml() {
    return this.dest;
  },
  get destImage() {
    return `${this.dest}/images`;
  },
  get destJs() {
    return `${this.dest}/js`;
  },
  get destSprite() {
    return `${this.dest}/images/sprites`;
  },
  get destStyleguide() {
    return `${this.dest}/styleguide`;
  }
};
