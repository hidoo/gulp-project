/* eslint max-statements: off */

import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as imagemin from 'gulp-imagemin';
import buildSprite, { svgo } from '../src/index.js';

const DEBUG = Boolean(process.env.DEBUG);

/**
 * convert svg contents to dataURL
 *
 * @param {Buffer|String} svg svg contents
 * @return {String}
 */
function toDataURL(svg) {
  const contents = svg.toString().trim().replace(/#fff/g, '#000');

  return `data:image/svg+xml,${encodeURIComponent(contents)}`;
}

/**
 * read built file
 *
 * @param {String} file filename
 * @return {String}
 */
async function readBuiltFile(file) {
  const content = await fs.readFile(file);

  return content.toString().trim();
}

describe('gulp-task-build-sprite-svg', () => {
  let dirname = null;
  let fixturesDir = null;
  let srcDir = null;
  let destDir = null;
  let expectedDir = null;
  let opts = null;

  before(() => {
    dirname = path.dirname(fileURLToPath(import.meta.url));
    fixturesDir = path.resolve(dirname, 'fixtures');
    srcDir = path.resolve(fixturesDir, 'src');
    destDir = path.resolve(fixturesDir, 'dest');
    expectedDir = path.resolve(fixturesDir, 'expected');
    opts = {
      src: `${srcDir}/**/sample-*.svg`,
      imgName: 'svg-sprite.svg',
      cssName: 'svg-sprite.styl',
      destImg: destDir,
      destCss: destDir,
      imgPath: './svg-sprite.svg'
    };
  });

  afterEach(async () => {
    // await fs.rm(destDir, { recursive: true });
    // await fs.mkdir(destDir);
  });

  it('should output files with minimum settings.', async () => {
    const task = buildSprite({
      ...opts
    });

    await new Promise((resolve) => task().on('finish', resolve));

    {
      const actual = await readBuiltFile(`${destDir}/svg-sprite.svg`);
      const expected = await readBuiltFile(`${expectedDir}/svg-sprite.svg`);

      if (DEBUG) {
        console.log('[DEBUG] actual: "%s"', toDataURL(actual));
        console.log('[DEBUG] expected: "%s"', toDataURL(expected));
      }

      assert(actual);
      assert.deepStrictEqual(actual, expected);
    }

    {
      const actual = await readBuiltFile(`${destDir}/svg-sprite.styl`);
      const expected = await readBuiltFile(`${expectedDir}/svg-sprite.styl`);

      assert(actual);
      assert.deepStrictEqual(actual, expected);
    }
  });

  it('should output compressed files with options.compress.', async () => {
    const task = buildSprite({
      ...opts,
      compress: true
    });

    await new Promise((resolve) => task().on('finish', resolve));

    {
      const actual = await readBuiltFile(`${destDir}/svg-sprite.svg`);
      const expected = await readBuiltFile(
        `${expectedDir}/svg-sprite.compressed.svg`
      );

      if (DEBUG) {
        console.log('[DEBUG] actual: "%s"', toDataURL(actual));
        console.log('[DEBUG] expected: "%s"', toDataURL(expected));
      }

      assert(actual);
      assert(await fs.stat(`${destDir}/svg-sprite.svg.gz`));
      assert.deepStrictEqual(actual, expected);
    }

    {
      const actual = await readBuiltFile(`${destDir}/svg-sprite.styl`);
      const expected = await readBuiltFile(
        `${expectedDir}/svg-sprite.compressed.styl`
      );

      assert(actual);
      assert.deepStrictEqual(actual, expected);
    }
  });

  it('should output files with path name and parameters in options.imgPath.', async () => {
    const task = buildSprite({
      ...opts,
      imgPath: './svg-sprite.svg?version=0.0.0'
    });

    await new Promise((resolve) => task().on('finish', resolve));

    {
      const actual = await readBuiltFile(`${destDir}/svg-sprite.svg`);
      const expected = await readBuiltFile(
        `${expectedDir}/svg-sprite.with-parameters.svg`
      );

      if (DEBUG) {
        console.log('[DEBUG] actual: "%s"', toDataURL(actual));
        console.log('[DEBUG] expected: "%s"', toDataURL(expected));
      }

      assert(actual);
      assert.deepStrictEqual(actual, expected);
    }

    {
      const actual = await readBuiltFile(`${destDir}/svg-sprite.styl`);
      const expected = await readBuiltFile(
        `${expectedDir}/svg-sprite.with-parameters.styl`
      );

      assert(actual);
      assert.deepStrictEqual(actual, expected);
    }
  });

  it('should output files includes scss format with options.cssPreprocessor = "sass".', async () => {
    const task = buildSprite({
      ...opts,
      cssName: 'svg-sprite.scss',
      cssPreprocessor: 'sass'
    });

    await new Promise((resolve) => task().on('finish', resolve));

    {
      const actual = await readBuiltFile(`${destDir}/svg-sprite.svg`);
      const expected = await readBuiltFile(`${expectedDir}/svg-sprite.svg`);

      if (DEBUG) {
        console.log('[DEBUG] actual: "%s"', toDataURL(actual));
        console.log('[DEBUG] expected: "%s"', toDataURL(expected));
      }

      assert(actual);
      assert.deepStrictEqual(actual, expected);
    }

    {
      const actual = await readBuiltFile(`${destDir}/svg-sprite.scss`);
      const expected = await readBuiltFile(`${expectedDir}/svg-sprite.scss`);

      assert(actual);
      assert.deepStrictEqual(actual, expected);
    }
  });

  it('should output files includes scss module format with options.cssPreprocessor = "sass:module".', async () => {
    const task = buildSprite({
      ...opts,
      cssName: 'svg-sprite.scss',
      cssPreprocessor: 'sass:module'
    });

    await new Promise((resolve) => task().on('finish', resolve));

    {
      const actual = await readBuiltFile(`${destDir}/svg-sprite.svg`);
      const expected = await readBuiltFile(`${expectedDir}/svg-sprite.svg`);

      if (DEBUG) {
        console.log('[DEBUG] actual: "%s"', toDataURL(actual));
        console.log('[DEBUG] expected: "%s"', toDataURL(expected));
      }

      assert(actual);
      assert.deepStrictEqual(actual, expected);
    }

    {
      const actual = await readBuiltFile(`${destDir}/svg-sprite.scss`);
      const expected = await readBuiltFile(
        `${expectedDir}/svg-sprite-module.scss`
      );

      assert(actual);
      assert.deepStrictEqual(actual, expected);
    }
  });

  it('should output files includes specified format with options.cssTemplate.', async () => {
    const task = buildSprite({
      ...opts,
      cssName: 'svg-sprite.css',
      cssTemplate: `${srcDir}/custom-template.hbs`,

      // ignore following options if options.cssTemplate specified
      cssPreprocessor: 'stylus'
    });

    await new Promise((resolve) => task().on('finish', resolve));

    {
      const actual = await readBuiltFile(`${destDir}/svg-sprite.svg`);
      const expected = await readBuiltFile(`${expectedDir}/svg-sprite.svg`);

      if (DEBUG) {
        console.log('[DEBUG] actual: "%s"', toDataURL(actual));
        console.log('[DEBUG] expected: "%s"', toDataURL(expected));
      }

      assert(actual);
      assert.deepStrictEqual(actual, expected);
    }

    {
      const actual = await readBuiltFile(`${destDir}/svg-sprite.css`);
      const expected = await readBuiltFile(`${expectedDir}/svg-sprite.css`);

      assert(actual);
      assert.deepStrictEqual(actual, expected);
    }
  });

  describe('exports imagemin plugins.', () => {
    it('should be accessible to imagemin plugins.', () => {
      assert(imagemin.svgo === svgo);
    });
  });
});
