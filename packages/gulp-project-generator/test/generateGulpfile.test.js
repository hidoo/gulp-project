/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'node:assert';
import fs from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import generateGulpfile from '../src/generateGulpfile.js';

describe('generateGulpfile', () => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const path = {
    src: resolve(__dirname, '../template'),
    dest: `${__dirname}/fixtures/dest`,
    expected: `${__dirname}/fixtures/expected`
  };

  afterEach((done) => {
    fs.rm(path.dest, { recursive: true }, () => fs.mkdir(path.dest, done));
  });

  it('should return Promise.', (done) => {
    const actual = generateGulpfile(path.src, path.dest, {});

    assert(actual instanceof Promise);
    actual.then(() => done());
  });

  it('should generate gulpfile.', async () => {
    await generateGulpfile(path.src, path.dest, {
      css: true,
      cssDeps: true,
      html: true,
      image: true,
      js: true,
      jsDeps: true,
      server: true,
      sprite: true,
      styleguide: true
    });

    const actual = fs.readFileSync(`${path.dest}/gulpfile.js`),
      expected = fs.readFileSync(`${path.expected}/gulpfile.js`);

    assert(actual);
    assert.deepStrictEqual(
      actual.toString().trim(),
      expected.toString().trim()
    );
  });

  it('should generate gulpfile if argument argument options.multiDevice is true.', async () => {
    await generateGulpfile(path.src, path.dest, {
      css: true,
      cssDeps: true,
      html: true,
      image: true,
      js: true,
      jsDeps: true,
      server: true,
      sprite: true,
      styleguide: true,
      multiDevice: true
    });

    const actual = fs.readFileSync(`${path.dest}/gulpfile.js`),
      expected = fs.readFileSync(`${path.expected}/gulpfile-multi-device.js`);

    assert(actual);
    assert.deepStrictEqual(
      actual.toString().trim(),
      expected.toString().trim()
    );
  });
});
