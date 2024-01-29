/* eslint max-len: off, no-magic-numbers: off, max-statements: off */

import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import gulp from 'gulp';
import buildCss from '../src/index.js';

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

describe('gulp-task-build-css-sass', () => {
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
      dest: destDir,
      verbose: false
    };
  });

  afterEach(async () => {
    await fs.rm(destDir, {recursive: true});
    await fs.mkdir(destDir);
  });

  it('should out css file with default options.', async () => {
    const task = buildCss({
      ...opts,
      src: `${srcDir}/style.scss`,
      compress: false
    });

    await new Promise((resolve) => task().on('finish', resolve));

    const actual = await readBuiltFile(`${destDir}/main.css`);
    const expected = await readBuiltFile(`${expectedDir}/main.css`);

    assert(actual);
    assert.equal(actual, expected);
  });

  it('should out specified named css file by options.filename.', async () => {
    const task = buildCss({
      ...opts,
      src: `${srcDir}/style.scss`,
      filename: 'hoge.css',
      compress: false
    });

    await new Promise((resolve) => task().on('finish', resolve));

    const actual = await readBuiltFile(`${destDir}/hoge.css`);
    const expected = await readBuiltFile(`${expectedDir}/main.css`);

    assert(actual);
    assert.equal(actual, expected);
  });

  it('should out css file applied vendor-prefix by autoprefixer and options.browsers.', async () => {
    const task = buildCss({
      ...opts,
      src: `${srcDir}/style.scss`,
      browsers: ['android >= 2.3'],
      compress: false
    });

    await new Promise((resolve) => task().on('finish', resolve));

    const actual = await readBuiltFile(`${destDir}/main.css`);
    const expected = await readBuiltFile(`${expectedDir}/main.browsers.css`);

    assert(actual);
    assert.equal(actual, expected);
  });

  it('should out css file applied vendor-prefix by autoprefixer and options.targets.', async () => {
    const task = buildCss({
      ...opts,
      src: `${srcDir}/style.scss`,
      targets: ['android >= 2.3'],
      compress: false
    });

    await new Promise((resolve) => task().on('finish', resolve));

    const actual = await readBuiltFile(`${destDir}/main.css`);
    const expected = await readBuiltFile(`${expectedDir}/main.browsers.css`);

    assert(actual);
    assert.equal(actual, expected);
  });

  it('should out minified and compressed css file by options.compress.', async () => {
    const task = buildCss({
      ...opts,
      src: `${srcDir}/style.scss`,
      compress: true
    });

    await new Promise((resolve) => task().on('finish', resolve));

    await Promise.all(
      ['css', 'min.css', 'min.css.gz'].map(async (ext) => {
        if (ext === '.css') {
          const actual = await readBuiltFile(`${destDir}/main.js`);
          const expected = await readBuiltFile(`${expectedDir}/main.js`);

          assert(actual);
          assert.equal(actual, expected);
        }
        else {
          const actual = await fs.readFile(`${destDir}/main.${ext}`);

          assert(actual);
        }
      })
    );
  });

  it('should out named minified and named compressed css file by options.compress and options.suffix.', async () => {
    const task = buildCss({
      ...opts,
      src: `${srcDir}/style.scss`,
      suffix: '.compressed',
      compress: true
    });

    await new Promise((resolve) => task().on('finish', resolve));

    await Promise.all(
      ['css', 'compressed.css', 'compressed.css.gz'].map(async (ext) => {
        if (ext === '.css') {
          const actual = await readBuiltFile(`${destDir}/main.js`);
          const expected = await readBuiltFile(`${expectedDir}/main.js`);

          assert(actual);
          assert.equal(actual, expected);
        }
        else {
          const actual = await fs.readFile(`${destDir}/main.${ext}`);

          assert(actual);
        }
      })
    );
  });

  it('should out minified and compressed css file with no suffix by options.compress and empty options.suffix.', async () => {
    const task = buildCss({
      ...opts,
      src: `${srcDir}/style.scss`,
      suffix: '',
      compress: true
    });

    await new Promise((resolve) => task().on('finish', resolve));

    await Promise.all(
      ['css', 'css.gz'].map(async (ext) => {
        const actual = await fs.readFile(`${destDir}/main.${ext}`);

        assert(actual);
      })
    );
  });

  it('should out css file not processed url() value without options.url.', async () => {
    const task = buildCss({
      ...opts,
      src: `${srcDir}/style.url.scss`,
      compress: false
    });

    await new Promise((resolve) => task().on('finish', resolve));

    const actual = await readBuiltFile(`${destDir}/main.css`);
    const expected = await readBuiltFile(`${expectedDir}/main.url-not-set.css`);

    assert(actual);
    assert.equal(actual, expected);
  });

  it('should out css file embed url() value by postcss-url and options.url.', async () => {
    const task = buildCss({
      ...opts,
      src: `${srcDir}/style.url.scss`,
      url: 'inline',
      compress: false
    });

    await new Promise((resolve) => task().on('finish', resolve));

    const actual = await readBuiltFile(`${destDir}/main.css`);
    const expected = await readBuiltFile(`${expectedDir}/main.url.css`);

    assert(actual);
    assert.equal(actual, expected);
  });

  it('should out css file embed url() value with encode type by postcss-url and options.url.', async () => {
    const task = buildCss({
      ...opts,
      src: `${srcDir}/style.url.scss`,
      url: 'inline',
      urlOptions: {encodeType: 'base64'},
      compress: false
    });

    await new Promise((resolve) => task().on('finish', resolve));

    const actual = await readBuiltFile(`${destDir}/main.css`);
    const expected = await readBuiltFile(`${expectedDir}/main.url-options.css`);

    assert(actual);
    assert.equal(actual, expected);
  });

  it('should out css file injected banner with options.banner.', async () => {
    const task = buildCss({
      ...opts,
      src: `${srcDir}/style.scss`,
      banner: '/*! copyright <%= pkg.author %> */\n',
      compress: false
    });

    await new Promise((resolve) => task().on('finish', resolve));

    const actual = await readBuiltFile(`${destDir}/main.css`);
    const expected = await readBuiltFile(`${expectedDir}/main.banner.css`);

    assert(actual);
    assert.equal(actual, expected);
  });

  it('should out css file removed unused styles by postcss-uncss and options.uncssTargets.', async () => {
    const task = buildCss({
      ...opts,
      src: `${srcDir}/style.scss`,
      uncssTargets: [`${srcDir}/target.html`],
      compress: false
    });

    await new Promise((resolve) => task().on('finish', resolve));

    const actual = await readBuiltFile(`${destDir}/main.css`);
    const expected = await readBuiltFile(`${expectedDir}/main.remove-unused.css`);

    assert(actual);
    assert.equal(actual, expected);
  });

  it('should out css file applied additional process with options.additionalProcess.', async () => {
    const task = buildCss({
      ...opts,
      src: `${srcDir}/style.scss`,
      additionalProcess(root) {
        root.walkRules(/\.block/, (rule) => {
          rule.selectors = rule.selectors.map(
            (selector) => selector.trim().replace(/\.block/, '.hoge')
          );
        });

        return root;
      },
      compress: false
    });

    await new Promise((resolve) => task().on('finish', resolve));

    const actual = await readBuiltFile(`${destDir}/main.css`);
    const expected = await readBuiltFile(`${expectedDir}/main.post-process.css`);

    assert(actual);
    assert.equal(actual, expected);
  });

  it('should not stop process if throw error.', async () => {
    const task = buildCss({
      ...opts,
      src: `${srcDir}/error.scss`,
      compress: false
    });

    await new Promise((resolve) => task().on('finish', resolve));
  });

  it('should call next task after files were outputted in gulp.series.', async () => {
    const task = buildCss({
      ...opts,
      src: `${srcDir}/style.scss`,
      compress: false
    });

    await new Promise((resolve) => {
      gulp.series(
        task,
        async () => {
          const actual = await readBuiltFile(`${destDir}/main.css`);
          const expected = await readBuiltFile(`${expectedDir}/main.css`);

          assert(actual);
          assert.deepEqual(actual, expected);
          resolve();
        }
      )();
    });
  });

});
