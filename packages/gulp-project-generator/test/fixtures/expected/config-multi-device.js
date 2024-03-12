/* eslint no-magic-numbers: off, prefer-named-capture-group: off */

import fs from 'node:fs/promises';
import { Command, InvalidArgumentError } from 'commander';

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
  .option('--skip-device <device>', 'skip target device tasks.', (value) => {
    if (!['desktop', 'mobile'].includes(value)) {
      throw new InvalidArgumentError();
    }
    return value;
  })
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
 * skiped tasks target device name
 *
 * @type {String}
 */
export const skipDevice = opts.skipDevice || '';

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

  // device
  desktop: '/desktop',
  mobile: '/mobile',

  // source details
  get srcCss() {
    return `${this.src}/css`;
  },
  get srcCssDesktop() {
    return `${this.srcCss}${this.desktop}`;
  },
  get srcCssMobile() {
    return `${this.srcCss}${this.mobile}`;
  },
  get srcData() {
    return `${this.src}/data`;
  },
  get srcHtml() {
    return `${this.src}/html`;
  },
  get srcHtmlDesktop() {
    return `${this.srcHtml}${this.desktop}`;
  },
  get srcHtmlMobile() {
    return `${this.srcHtml}${this.mobile}`;
  },
  get srcImage() {
    return `${this.src}/image`;
  },
  get srcImageDesktop() {
    return `${this.srcImage}${this.desktop}`;
  },
  get srcImageMobile() {
    return `${this.srcImage}${this.mobile}`;
  },
  get srcJs() {
    return `${this.src}/js`;
  },
  get srcJsDesktop() {
    return `${this.srcJs}${this.desktop}`;
  },
  get srcJsMobile() {
    return `${this.srcJs}${this.mobile}`;
  },
  get srcSprite() {
    return `${this.src}/sprite`;
  },
  get srcSpriteDesktop() {
    return `${this.srcSprite}${this.desktop}`;
  },
  get srcSpriteMobile() {
    return `${this.srcSprite}${this.mobile}`;
  },
  get srcStyleguide() {
    return `${this.dest}/css`;
  },
  get srcStyleguideDesktop() {
    return this.srcStyleguide;
  },
  get srcStyleguideMobile() {
    return `${this.dest}${this.mobile}/css`;
  },

  // destinaion details
  get destCss() {
    return `${this.dest}/css`;
  },
  get destCssDesktop() {
    return this.destCss;
  },
  get destCssMobile() {
    return `${this.dest}${this.mobile}/css`;
  },
  get destHtml() {
    return this.dest;
  },
  get destHtmlDesktop() {
    return this.destHtml;
  },
  get destHtmlMobile() {
    return `${this.dest}${this.mobile}`;
  },
  get destImage() {
    return `${this.dest}/images`;
  },
  get destImageDesktop() {
    return this.destImage;
  },
  get destImageMobile() {
    return `${this.dest}${this.mobile}/images`;
  },
  get destJs() {
    return `${this.dest}/js`;
  },
  get destJsDesktop() {
    return this.destJs;
  },
  get destJsMobile() {
    return `${this.dest}${this.mobile}/js`;
  },
  get destSprite() {
    return `${this.dest}/images/sprites`;
  },
  get destSpriteDesktop() {
    return this.destSprite;
  },
  get destSpriteMobile() {
    return `${this.dest}${this.mobile}/images/sprites`;
  },
  get destStyleguide() {
    return `${this.dest}/styleguide`;
  },
  get destStyleguideDesktop() {
    return this.destStyleguide;
  },
  get destStyleguideMobile() {
    return `${this.dest}${this.mobile}/styleguide`;
  }
};
