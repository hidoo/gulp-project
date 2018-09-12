/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import {resolve} from 'path';
import rimraf from 'rimraf';
import glob from 'glob';
import generateJsFiles from '../src/generateJsFiles';

describe('generateJsFiles', () => {
  const path = {
    src: resolve(__dirname, '../template'),
    dest: `${__dirname}/fixtures/dest`,
    expected: `${__dirname}/fixtures/expected`
  };

  afterEach((done) =>
    rimraf(`${path.dest}/*`, done)
  );

  it('should return Promise.', (done) => {
    const actual = generateJsFiles(path.src, path.dest, {});

    assert(actual instanceof Promise);
    actual.then(() => done());
  });

  it('should not generate if argument options.js is false.', async () => {
    await generateJsFiles(path.src, path.dest, {js: false});

    const actualTask = glob.sync(`${path.dest}/task/js.js`),
          actualAssetList = glob.sync(`${path.dest}/src/js/**/*`);

    assert(Array.isArray(actualTask) && actualTask.length === 0);
    assert(Array.isArray(actualAssetList) && actualAssetList.length === 0);
  });

  it('should generate files for javascript task if argument options.js is true and argument options.jsBundler is "browserify".', async () => {
    await generateJsFiles(path.src, path.dest, {js: true, jsBundler: 'browserify'});

    const actualTask = fs.readFileSync(`${path.dest}/task/js.js`),
          expectedTask = fs.readFileSync(`${path.expected}/task-js-browserify.js`),
          actualAssetList = glob.sync(`${path.dest}/src/js/**/*`),
          expectedAssetList = glob.sync(`${path.src}/src/js/**/*`);

    assert(actualTask);
    assert.deepStrictEqual(actualTask.toString().trim(), expectedTask.toString().trim());
    assert.deepStrictEqual(
      actualAssetList.map((filepath) => filepath.replace(path.dest, '')),
      expectedAssetList.map((filepath) => filepath.replace(path.src, ''))
    );
  });

  it('should generate files for javascript task if argument options.js is true and argument options.jsBundler is "rollup".', async () => {
    await generateJsFiles(path.src, path.dest, {js: true, jsBundler: 'rollup'});

    const actualTask = fs.readFileSync(`${path.dest}/task/js.js`),
          expectedTask = fs.readFileSync(`${path.expected}/task-js-rollup.js`),
          actualAssetList = glob.sync(`${path.dest}/src/js/**/*`),
          expectedAssetList = glob.sync(`${path.src}/src/js/**/*`);

    assert(actualTask);
    assert.deepStrictEqual(actualTask.toString().trim(), expectedTask.toString().trim());
    assert.deepStrictEqual(
      actualAssetList.map((filepath) => filepath.replace(path.dest, '')),
      expectedAssetList.map((filepath) => filepath.replace(path.src, ''))
    );
  });

});
