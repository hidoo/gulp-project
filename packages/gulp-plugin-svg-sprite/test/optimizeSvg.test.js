/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import cheerio from 'cheerio';
import optimizeSvg from '../src/optimizeSvg';

describe('gulp-plugin-svg-sprite', () => {
  const path = {
    src: `${__dirname}/fixtures/src`,
    expected: `${__dirname}/fixtures/expected`
  };

  it('should return optimized svg string', async () => {
    const result = optimizeSvg(fs.readFileSync(`${path.src}/not-optimized.svg`)),
          $ = cheerio.load(result, {ignoreWhitespace: true, xmlMode: true});

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
