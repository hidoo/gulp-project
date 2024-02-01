/* eslint max-len: off, no-magic-numbers: off, max-statements: off */

import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import buildJs from '../src/index.js';

let pkg = null;

/**
 * read built file
 *
 * @param {String} file filename
 * @return {String}
 */
async function readBuiltFile(file) {
  const content = await fs.readFile(file);

  return content.toString().trim()
    // eslint-disable-next-line prefer-named-capture-group
    .replace(/^(\s*\/\*[\s\S]*?\*\/\s*|\s*\/\/.*\n)*/, '')
    .replace(/<core-js version>/g, pkg.devDependencies['core-js']);
}

describe('gulp-task-build-js-browserify', () => {
  let dirname = null;
  let fixturesDir = null;
  let srcDir = null;
  let destDir = null;
  let expectedDir = null;
  let opts = null;

  before(async () => {
    pkg = JSON.parse(
      await fs.readFile(
        path.resolve(process.cwd(), 'package.json')
      )
    );
    dirname = path.dirname(fileURLToPath(import.meta.url));
    fixturesDir = path.resolve(dirname, 'fixtures');
    srcDir = path.resolve(fixturesDir, 'src');
    destDir = path.resolve(fixturesDir, 'dest');
    expectedDir = path.resolve(fixturesDir, 'expected');
    opts = {
      dest: destDir,
      verbose: true
    };
  });

  after(() => {
    pkg = null;
    dirname = null;
    fixturesDir = null;
    srcDir = null;
    destDir = null;
    expectedDir = null;
    opts = null;
  });

  afterEach(async () => {
    await fs.rm(destDir, {recursive: true});
    await fs.mkdir(destDir);
  });

  it('should out js file with default options.', async () => {
    const task = buildJs({
      ...opts,
      src: `${srcDir}/main.js`
    });

    await new Promise((resolve) => task().on('finish', resolve));

    const actual = await readBuiltFile(`${destDir}/main.js`);
    const expected = await readBuiltFile(`${expectedDir}/main.js`);

    assert(actual);
    assert.equal(actual, expected);
  });

  it('should out specified named js file by options.filename.', async () => {
    const task = buildJs({
      ...opts,
      src: `${srcDir}/main.js`,
      filename: 'main.hoge.js'
    });

    await new Promise((resolve) => task().on('finish', resolve));

    const actual = await readBuiltFile(`${destDir}/main.hoge.js`);
    const expected = await readBuiltFile(`${expectedDir}/main.js`);

    assert(actual);
    assert.equal(actual, expected);
  });

  it('should out polyfilled js file by "@babel/preset-env" and options.browsers.', async () => {
    const task = buildJs({
      ...opts,
      src: `${srcDir}/main.js`,
      filename: 'main.browsers.js',
      browsers: 'ie >= 8'
    });

    await new Promise((resolve) => task().on('finish', resolve));

    const actual = await readBuiltFile(`${destDir}/main.browsers.js`);
    const expected = await readBuiltFile(`${expectedDir}/main.browsers.js`);

    assert(actual);
    assert.equal(actual, expected);
  });

  it('should out polyfilled js file by "@babel/preset-env" and options.targets.', async () => {
    const task = buildJs({
      ...opts,
      src: `${srcDir}/main.js`,
      filename: 'main.targets.js',
      targets: 'ie >= 8'
    });

    await new Promise((resolve) => task().on('finish', resolve));

    const actual = await readBuiltFile(`${destDir}/main.targets.js`);
    const expected = await readBuiltFile(`${expectedDir}/main.browsers.js`);

    assert(actual);
    assert.equal(actual, expected);
  });

  it('should out minified and compressed js files by options.compress.', async () => {
    const task = buildJs({
      ...opts,
      src: `${srcDir}/main.js`,
      compress: true
    });

    await new Promise((resolve) => task().on('finish', resolve));

    await Promise.all(
      ['js', 'min.js', 'min.js.gz'].map(async (ext) => {
        if (ext === '.js') {
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

  it('should out named minified and named compressed js files by options.compress and options.suffix.', async () => {
    const task = buildJs({
      ...opts,
      src: `${srcDir}/main.js`,
      suffix: '.compressed',
      compress: true
    });

    await new Promise((resolve) => task().on('finish', resolve));

    await Promise.all(
      ['js', 'compressed.js', 'compressed.js.gz'].map(async (ext) => {
        if (ext === '.js') {
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

  it('should out minified and compressed js files with no suffix by options.compress and empty options.suffix.', async () => {
    const task = buildJs({
      ...opts,
      src: `${srcDir}/main.js`,
      suffix: '',
      compress: true
    });

    await new Promise((resolve) => task().on('finish', resolve));

    await Promise.all(
      ['js', 'js.gz'].map(async (ext) => {
        const actual = await fs.readFile(`${destDir}/main.${ext}`);

        assert(actual);
      })
    );
  });

});
