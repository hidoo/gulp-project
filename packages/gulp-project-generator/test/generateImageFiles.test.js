/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import {resolve} from 'path';
import rimraf from 'rimraf';
import glob from 'glob';
import generateImageFiles from '../src/generateImageFiles';

describe('generateImageFiles', () => {
  const path = {
    src: resolve(__dirname, '../template'),
    dest: `${__dirname}/fixtures/dest`,
    expected: `${__dirname}/fixtures/expected`
  };

  afterEach((done) =>
    rimraf(`${path.dest}/*`, done)
  );

  it('should return Promise.', (done) => {
    const actual = generateImageFiles(path.src, path.dest, {});

    assert(actual instanceof Promise);
    actual.then(() => done());
  });

  it('should not generate if argument options.image is false.', async () => {
    await generateImageFiles(path.src, path.dest, {image: false});

    const actualTask = glob.sync(`${path.dest}/task/image.js`),
          actualAssetList = glob.sync(`${path.dest}/src/image/**/*`);

    assert(Array.isArray(actualTask) && actualTask.length === 0);
    assert(Array.isArray(actualAssetList) && actualAssetList.length === 0);
  });

  it('should generate files image task if argument options.image is true.', async () => {
    await generateImageFiles(path.src, path.dest, {image: true});

    const actualTask = fs.readFileSync(`${path.dest}/task/image.js`),
          expectedTask = fs.readFileSync(`${path.expected}/task-image.js`),
          actualAssetList = glob.sync(`${path.dest}/src/image/**/*`),
          expectedAssetList = glob.sync(`${path.src}/src/image/**/*`);

    assert(actualTask);
    assert.deepStrictEqual(actualTask.toString().trim(), expectedTask.toString().trim());
    assert.deepStrictEqual(
      actualAssetList.map((filepath) => filepath.replace(path.dest, '')),
      expectedAssetList.map((filepath) => filepath.replace(path.src, ''))
    );
  });

});
