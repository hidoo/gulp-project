/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'node:assert';
import fs from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {glob} from 'glob';
import generateHtmlFiles from '../src/generateHtmlFiles.js';

describe('generateHtmlFiles', () => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const path = {
    src: resolve(__dirname, '../template'),
    dest: `${__dirname}/fixtures/dest`,
    expected: `${__dirname}/fixtures/expected`
  };

  afterEach((done) => {
    fs.rm(
      path.dest,
      {recursive: true},
      () => fs.mkdir(path.dest, done)
    );
  });

  it('should return Promise.', (done) => {
    const actual = generateHtmlFiles(path.src, path.dest, {});

    assert(actual instanceof Promise);
    actual.then(() => done());
  });

  it('should not generate if argument options.html is false.', async () => {
    await generateHtmlFiles(path.src, path.dest, {html: false});

    const actualTask = glob.sync(`${path.dest}/task/html.js`),
          actualAssetList = glob.sync(`${path.dest}/src/html/**/*`);

    assert(Array.isArray(actualTask));
    assert(Array.isArray(actualAssetList));
    assert.deepStrictEqual(actualTask, []);
    assert.deepStrictEqual(actualAssetList, []);
  });

  it('should generate files html task if argument options.html is true.', async () => {
    await generateHtmlFiles(path.src, path.dest, {html: true});

    const actualTask = fs.readFileSync(`${path.dest}/task/html.js`),
          expectedTask = fs.readFileSync(`${path.expected}/task-html.js`),
          actualAssetList = glob.sync(`${path.dest}/src/html/**/*`, {nodir: true})
            .map((filepath) => filepath.replace(path.dest, ''))
            .sort(),
          expectedAssetList = [
            '/src/html/layouts/base.hbs',
            '/src/html/pages/index.hbs',
            '/src/html/pages/page-list.hbs',
            '/src/html/partials/head/meta.hbs',
            '/src/html/partials/head/ogp.hbs',
            '/src/html/partials/head/seo.hbs'
          ];

    assert(actualTask);
    assert(Array.isArray(actualAssetList));
    assert.deepStrictEqual(actualTask.toString().trim(), expectedTask.toString().trim());
    assert.deepStrictEqual(actualAssetList, expectedAssetList);
  });

  it('should generate files html task if argument options.html is true and argument options.multiDevice is true.', async () => {
    await generateHtmlFiles(path.src, path.dest, {html: true, multiDevice: true});

    const actualTask = fs.readFileSync(`${path.dest}/task/html.js`),
          expectedTask = fs.readFileSync(`${path.expected}/task-html-multi-device.js`),
          actualAssetList = glob.sync(`${path.dest}/src/html/**/*`, {nodir: true})
            .map((filepath) => filepath.replace(path.dest, ''))
            .sort(),
          expectedAssetList = [
            '/src/html/desktop/index.hbs',
            '/src/html/desktop/page-list.hbs',
            '/src/html/layouts/base.hbs',
            '/src/html/mobile/index.hbs',
            '/src/html/mobile/page-list.hbs',
            '/src/html/partials/head/meta.hbs',
            '/src/html/partials/head/ogp.hbs',
            '/src/html/partials/head/seo.hbs'
          ];

    assert(actualTask);
    assert(Array.isArray(actualAssetList));
    assert.deepStrictEqual(actualTask.toString().trim(), expectedTask.toString().trim());
    assert.deepStrictEqual(actualAssetList, expectedAssetList);
  });

});
