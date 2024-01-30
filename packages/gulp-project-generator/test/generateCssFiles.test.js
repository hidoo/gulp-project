import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {glob} from 'glob';
import generateCssFiles from '../src/generateCssFiles.js';

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

describe('generateCssFiles', () => {
  let dirname = null;
  let fixturesDir = null;
  let srcDir = null;
  let destDir = null;
  let expectedDir = null;

  before(() => {
    dirname = path.dirname(fileURLToPath(import.meta.url));
    fixturesDir = path.resolve(dirname, 'fixtures');
    srcDir = path.resolve(dirname, '../template');
    destDir = path.resolve(fixturesDir, 'dest');
    expectedDir = path.resolve(fixturesDir, 'expected');
  });

  afterEach(async () => {
    await fs.rm(destDir, {recursive: true});
    await fs.mkdir(destDir);
  });

  it('should return Promise.', (done) => {
    const actual = generateCssFiles(srcDir, destDir, {});

    assert(actual instanceof Promise);
    actual.then(() => done());
  });

  it('should not generate if argument options.css is false.', async () => {
    await generateCssFiles(srcDir, destDir, {css: false});

    const actualTask = glob.sync(`${destDir}/task/css.js`, {nodir: true});
    const actualAssetList = glob.sync(`${destDir}/src/css/**/*`, {nodir: true});

    assert(Array.isArray(actualTask));
    assert(Array.isArray(actualAssetList));
    assert.deepStrictEqual(actualTask, []);
    assert.deepStrictEqual(actualAssetList, []);
  });

  it('should generate files for css task if argument options.css is true.', async () => {
    await generateCssFiles(srcDir, destDir, {css: true});

    const actual = await readBuiltFile(`${destDir}/task/css.js`);
    const expected = await readBuiltFile(`${expectedDir}/task-css.js`);
    const assets = (await glob(`${destDir}/src/css/**/*`, {nodir: true}))
      .map((filepath) => filepath.replace(destDir, ''))
      .sort();

    assert.deepEqual(actual, expected);
    assert.deepEqual(
      assets,
      [
        '/src/css/README.md',
        '/src/css/main.styl'
      ]
    );
  });

  it('should generate files for css task if options.css is true and options.cssDeps is true.', async () => {
    await generateCssFiles(srcDir, destDir, {css: true, cssDeps: true});

    const actual = await readBuiltFile(`${destDir}/task/css.js`);
    const expected = await readBuiltFile(`${expectedDir}/task-css-deps.js`);
    const assets = (await glob(`${destDir}/src/css/**/*`, {nodir: true}))
      .map((filepath) => filepath.replace(destDir, ''))
      .sort();

    assert.deepEqual(actual, expected);
    assert.deepEqual(
      assets,
      [
        '/src/css/README.md',
        '/src/css/deps/sample-a.css',
        '/src/css/deps/sample-b.css',
        '/src/css/main.styl'
      ]
    );
  });

  it('should generate files for css task if options.css is true and options.cssPreprocessor is "sass".', async () => {
    await generateCssFiles(srcDir, destDir, {css: true, cssPreprocessor: 'sass'});

    const actual = await readBuiltFile(`${destDir}/task/css.js`);
    const expected = await readBuiltFile(`${expectedDir}/task-css-sass.js`);
    const assets = (await glob(`${destDir}/src/css/**/*`, {nodir: true}))
      .map((filepath) => filepath.replace(destDir, ''))
      .sort();

    assert.deepEqual(actual, expected);
    assert.deepEqual(
      assets,
      [
        '/src/css/README.md',
        '/src/css/main.scss'
      ]
    );
  });

  it('should generate files for css task if options.css is true and options.multiDevice is true.', async () => {
    await generateCssFiles(srcDir, destDir, {css: true, multiDevice: true});

    const actual = await readBuiltFile(`${destDir}/task/css.js`);
    const expected = await readBuiltFile(`${expectedDir}/task-css-multi-device.js`);
    const assets = (await glob(`${destDir}/src/css/**/*`, {nodir: true}))
      .map((filepath) => filepath.replace(destDir, ''))
      .sort();

    assert.deepEqual(actual, expected);
    assert.deepEqual(
      assets,
      [
        '/src/css/desktop/README.md',
        '/src/css/desktop/main.styl',
        '/src/css/mobile/README.md',
        '/src/css/mobile/main.styl'
      ]
    );
  });

  it('should generate files for css task if options.css is true and options.multiDevice is true and options.cssDeps is true.', async () => {
    await generateCssFiles(srcDir, destDir, {css: true, cssDeps: true, multiDevice: true});

    const actual = await readBuiltFile(`${destDir}/task/css.js`);
    const expected = await readBuiltFile(`${expectedDir}/task-css-multi-device-deps.js`);
    const assets = (await glob(`${destDir}/src/css/**/*`, {nodir: true}))
      .map((filepath) => filepath.replace(destDir, ''))
      .sort();

    assert.deepEqual(actual, expected);
    assert.deepEqual(
      assets,
      [
        '/src/css/desktop/README.md',
        '/src/css/desktop/deps/sample-a.css',
        '/src/css/desktop/deps/sample-b.css',
        '/src/css/desktop/main.styl',
        '/src/css/mobile/README.md',
        '/src/css/mobile/deps/sample-a.css',
        '/src/css/mobile/deps/sample-b.css',
        '/src/css/mobile/main.styl'
      ]
    );
  });

  it('should generate files for css task if options.css is true and options.multiDevice is true and options.cssPreprocessor is "sass".', async () => {
    await generateCssFiles(srcDir, destDir, {css: true, multiDevice: true, cssPreprocessor: 'sass'});

    const actual = await readBuiltFile(`${destDir}/task/css.js`);
    const expected = await readBuiltFile(`${expectedDir}/task-css-multi-device-sass.js`);
    const assets = (await glob(`${destDir}/src/css/**/*`, {nodir: true}))
      .map((filepath) => filepath.replace(destDir, ''))
      .sort();

    assert.deepEqual(actual, expected);
    assert.deepEqual(
      assets,
      [
        '/src/css/desktop/README.md',
        '/src/css/desktop/main.scss',
        '/src/css/mobile/README.md',
        '/src/css/mobile/main.scss'
      ]
    );
  });

});
