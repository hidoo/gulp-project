import assert from 'node:assert';
import fs from 'node:fs';
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import cheerio from 'cheerio';
import optimizeSvg from '../src/optimizeSvg.js';

describe('gulp-plugin-svg-sprite', () => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const path = {
    src: `${__dirname}/fixtures/src`,
    expected: `${__dirname}/fixtures/expected`
  };

  it('should return optimized svg string', () => {
    const result = optimizeSvg(fs.readFileSync(`${path.src}/not-optimized.svg`)),
          $ = cheerio.load(result, {ignoreWhitespace: true, xmlMode: true}); // eslint-disable-line id-length

    const $styles = $('style'),
          $notRootSvg = $('svg').filter((index, svg) => $(svg).parent()[0]),
          $hasInlineStyle = $('[style]'),
          $hasClass = $('[class]'),
          $hasDataNameAttr = $('[data-name]');

    assert(typeof result === 'string');
    assert($styles.length === 0);
    assert(typeof $notRootSvg.attr('xmlns') === 'undefined');
    assert(typeof $notRootSvg.attr('xmlns:xlink') === 'undefined');
    assert(typeof $hasInlineStyle.attr('id') === 'undefined');
    assert($hasClass.length === 0);
    assert($hasDataNameAttr.length === 0);
  });

});
