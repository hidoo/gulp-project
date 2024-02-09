import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';
import optimizeSvg from '../src/optimizeSvg.js';

describe('gulp-plugin-svg-sprite', () => {
  let dirname = null;
  let fixturesDir = null;
  let srcDir = null;

  before(() => {
    dirname = path.dirname(fileURLToPath(import.meta.url));
    fixturesDir = path.resolve(dirname, 'fixtures');
    srcDir = path.resolve(fixturesDir, 'src');
  });

  it('should return optimized svg string', async () => {
    const result = optimizeSvg(
      await fs.readFile(`${srcDir}/not-optimized.svg`)
    );

    // eslint-disable-next-line id-length
    const $ = cheerio.load(result, { ignoreWhitespace: true, xmlMode: true });

    const $styles = $('style');
    const $notRootSvg = $('svg').filter((index, svg) => $(svg).parent()[0]);
    const $hasInlineStyle = $('[style]');
    const $hasClass = $('[class]');
    const $hasDataNameAttr = $('[data-name]');

    assert.equal(typeof result, 'string');
    assert.equal($styles.length, 0);
    assert.equal(typeof $notRootSvg.attr('xmlns'), 'undefined');
    assert.equal(typeof $notRootSvg.attr('xmlns:xlink'), 'undefined');
    assert.equal(typeof $hasInlineStyle.attr('id'), 'undefined');
    assert.equal($hasClass.length, 0);
    assert.equal($hasDataNameAttr.length, 0);
  });
});
