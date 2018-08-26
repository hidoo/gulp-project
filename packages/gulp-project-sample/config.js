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
 * ファイルのパスに関する設定
 * @type {Object}
 */
export const path = {

  // base
  src: './src',
  dest: './public',

  // roles
  css: '/css',
  image: '/images',

  // source details
  get srcCss() { return `${this.src}${this.css}`; },
  get srcImage() { return `${this.src}${this.image}`; },

  // destinaion details
  get destCss() { return `${this.dest}${this.css}`; },
  get destImage() { return `${this.dest}${this.image}`; }
};
