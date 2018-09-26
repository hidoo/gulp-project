/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import {resolve} from 'path';
import rimraf from 'rimraf';
import generateDotFiles from '../src/generateDotFiles';

describe('generateDotFiles', () => {
  const path = {
    src: resolve(__dirname, '../template'),
    dest: `${__dirname}/fixtures/dest`,
    expected: `${__dirname}/fixtures/expected`
  };

  afterEach((done) =>
    rimraf(`${path.dest}/.*`, done)
  );

  it('should return Promise.', (done) => {
    const actual = generateDotFiles(path.src, path.dest, {});

    assert(actual instanceof Promise);
    actual.then(() => done());
  });

  it('should generate dot files.', async () => {
    await generateDotFiles(path.src, path.dest, {
      css: true,
      html: true,
      image: true,
      js: true,
      server: true,
      sprite: true,
      styleguide: true
    });

    const files = [
      '.babelrc.js',
      '.editorconfig',
      '.eslintignore',
      '.eslintrc.js',
      '.gitattributes',
      '.gitignore'
    ];

    files.forEach((file) => {
      const actual = fs.readFileSync(`${path.dest}/${file}`),
            expected = fs.readFileSync(`${path.expected}/${file}`);

      assert(actual);
      assert.deepStrictEqual(actual.toString().trim(), expected.toString().trim());
    });
  });

  it('should generate dot files if argument options.multiDevice is true.', async () => {
    await generateDotFiles(path.src, path.dest, {
      css: true,
      html: true,
      image: true,
      js: true,
      server: true,
      sprite: true,
      styleguide: true,
      multiDevice: true
    });

    const files = [
      '.babelrc.js',
      '.editorconfig',
      '.eslintignore',
      '.eslintrc.js',
      '.gitattributes',
      '.gitignore'
    ];

    files.forEach((file) => {
      const actual = fs.readFileSync(`${path.dest}/${file}`),
            expected = fs.readFileSync(`${path.expected}/${file}`);

      assert(actual);
      assert.deepStrictEqual(actual.toString().trim(), expected.toString().trim());
    });
  });

  it('should generate dot files if argument options.conventionalCommits is true.', async () => {
    await generateDotFiles(path.src, path.dest, {
      css: true,
      html: true,
      image: true,
      js: true,
      server: true,
      sprite: true,
      styleguide: true,
      conventionalCommits: true
    });

    const files = [
      '.babelrc.js',
      '.commitlintrc.js',
      '.editorconfig',
      '.eslintignore',
      '.eslintrc.js',
      '.gitattributes',
      '.gitignore'
    ];

    files.forEach((file) => {
      const actual = fs.readFileSync(`${path.dest}/${file}`),
            expected = fs.readFileSync(`${path.expected}/${file}`);

      assert(actual);
      assert.deepStrictEqual(actual.toString().trim(), expected.toString().trim());
    });
  });

});
