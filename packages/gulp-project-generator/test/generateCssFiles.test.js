/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import {resolve} from 'path';
import rimraf from 'rimraf';
import glob from 'glob';
import generateCssFiles from '../src/generateCssFiles';

describe('generateCssFiles', () => {
  const path = {
    src: resolve(__dirname, '../template'),
    dest: `${__dirname}/fixtures/dest`,
    expected: `${__dirname}/fixtures/expected`
  };

  afterEach((done) =>
    rimraf(`${path.dest}/*`, done)
  );

  it('should return Promise.', (done) => {
    const actual = generateCssFiles(path.src, path.dest, {});

    assert(actual instanceof Promise);
    actual.then(() => done());
  });

  it('should not generate if argument options.css is false.', async () => {
    await generateCssFiles(path.src, path.dest, {css: false});

    const actualTask = glob.sync(`${path.dest}/task/css.js`),
          actualAssetList = glob.sync(`${path.dest}/src/css/**/*`);

    assert(Array.isArray(actualTask) && actualTask.length === 0);
    assert(Array.isArray(actualAssetList) && actualAssetList.length === 0);
  });

  it('should generate files css task if argument options.css is true.', async () => {
    await generateCssFiles(path.src, path.dest, {css: true});

    const actualTask = fs.readFileSync(`${path.dest}/task/css.js`),
          expectedTask = fs.readFileSync(`${path.expected}/task-css.js`),
          actualAssetList = glob.sync(`${path.dest}/src/css/**/*`),
          expectedAssetList = glob.sync(`${path.src}/src/css/**/*`);

    assert(actualTask);
    assert.deepStrictEqual(actualTask.toString().trim(), expectedTask.toString().trim());
    assert.deepStrictEqual(
      actualAssetList.map((filepath) => filepath.replace(path.dest, '')),
      expectedAssetList.map((filepath) => filepath.replace(path.src, ''))
    );
  });

});
