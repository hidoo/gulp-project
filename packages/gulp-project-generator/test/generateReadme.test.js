/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'node:assert';
import fs from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import generateReadme from '../src/generateReadme.js';

describe('generateReadme', () => {
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
    const actual = generateReadme('hoge-project', path.src, path.dest, {});

    assert(actual instanceof Promise);
    actual.then(() => done());
  });

  it('should generate README.md.', async () => {
    await generateReadme('hoge-project', path.src, path.dest, {
      css: true,
      html: true,
      image: true,
      js: true,
      server: true,
      sprite: true,
      styleguide: true
    });

    const actual = fs.readFileSync(`${path.dest}/README.md`),
      expected = fs.readFileSync(`${path.expected}/README.md`);

    assert(actual);
    assert.deepStrictEqual(
      actual.toString().trim(),
      expected.toString().trim()
    );
  });

  it('should generate README.md if argument options.multiDevice is true.', async () => {
    await generateReadme('hoge-project', path.src, path.dest, {
      css: true,
      html: true,
      image: true,
      js: true,
      server: true,
      sprite: true,
      styleguide: true,
      multiDevice: true
    });

    const actual = fs.readFileSync(`${path.dest}/README.md`),
      expected = fs.readFileSync(`${path.expected}/README-multi-device.md`);

    assert(actual);
    assert.deepStrictEqual(
      actual.toString().trim(),
      expected.toString().trim()
    );
  });
});
