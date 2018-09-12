/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import {resolve} from 'path';
import rimraf from 'rimraf';
import glob from 'glob';
import generateHtmlFiles from '../src/generateHtmlFiles';

describe('generateHtmlFiles', () => {
  const path = {
    src: resolve(__dirname, '../template'),
    dest: `${__dirname}/fixtures/dest`,
    expected: `${__dirname}/fixtures/expected`
  };

  afterEach((done) =>
    rimraf(`${path.dest}/*`, done)
  );

  it('should return Promise.', (done) => {
    const actual = generateHtmlFiles(path.src, path.dest, {});

    assert(actual instanceof Promise);
    actual.then(() => done());
  });

  it('should not generate if argument options.html is false.', async () => {
    await generateHtmlFiles(path.src, path.dest, {html: false});

    const actualTask = glob.sync(`${path.dest}/task/html.js`),
          actualAssetList = glob.sync(`${path.dest}/src/html/**/*`);

    assert(Array.isArray(actualTask) && actualTask.length === 0);
    assert(Array.isArray(actualAssetList) && actualAssetList.length === 0);
  });

  it('should generate files html task if argument options.html is true.', async () => {
    await generateHtmlFiles(path.src, path.dest, {html: true});

    const actualTask = fs.readFileSync(`${path.dest}/task/html.js`),
          expectedTask = fs.readFileSync(`${path.expected}/task-html.js`),
          actualAssetList = glob.sync(`${path.dest}/src/html/**/*`),
          expectedAssetList = glob.sync(`${path.src}/src/html/**/*`);

    assert(actualTask);
    assert.deepStrictEqual(actualTask.toString().trim(), expectedTask.toString().trim());
    assert.deepStrictEqual(
      actualAssetList.map((filepath) => filepath.replace(path.dest, '')),
      expectedAssetList.map((filepath) => filepath.replace(path.src, ''))
    );
  });

});
