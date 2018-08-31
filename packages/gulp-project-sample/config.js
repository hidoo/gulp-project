/* eslint no-process-env: 0 */

/**
 * adjust NODE_ENV
 * + It use 'development', when process.env.NODE_ENV is not valid value.
 * + Otherwise use the value of process.env.NODE_ENV as it is.
 */
if (typeof process.env.NODE_ENV !== 'string' || process.env.NODE_ENV === '') {
  process.env.NODE_ENV = 'development';
}

/**
 * package.json
 * @type {Object}
 */
export {default as pkg} from './package.json';

/**
 * compress flag
 * + It is true, when process.env.NODE_ENV is not 'development'.
 * @type {Boolean}
 */
export const compress = process.env.NODE_ENV !== 'development' || false; // eslint-disable-line max-len

/**
 * path settings
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

  // destinaion details
  get destCss() { return `${this.dest}/css`; },
  get destHtml() { return this.dest; },
  get destImage() { return `${this.dest}/images`; },
  get destJs() { return `${this.dest}/js`; },
  get destSprite() { return `${this.dest}/images/sprites`; }
};
