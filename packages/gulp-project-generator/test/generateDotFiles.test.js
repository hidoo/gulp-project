/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import {resolve} from 'path';
import rimraf from 'rimraf';
import generateDotFiles from '../src/generateDotFiles';

describe('generateDotFiles', () => {
  let path = null;

  before(() => {
    path = {
      src: resolve(__dirname, '../template'),
      dest: `${__dirname}/fixtures/dest`,
      expected: `${__dirname}/fixtures/expected`
    };
  });

  afterEach((done) => {
    rimraf(`${path.dest}/.*`, done);
  });

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
      ['.babelrc.js', '.babelrc.js'],
      ['.editorconfig', '.editorconfig'],
      ['.eslintignore', '.eslintignore'],
      ['.eslintrc.js', '.eslintrc.js'],
      ['.gitattributes', '.gitattributes'],
      ['.gitignore', '.gitignore'],
      ['.huskyrc.js', '.huskyrc.js'],
      ['.lintstagedrc.js', '.lintstagedrc.js']
    ];

    files.forEach((file) => {
      const actual = fs.readFileSync(`${path.dest}/${file[0]}`).toString().trim(),
            expected = fs.readFileSync(`${path.expected}/${file[1]}`).toString().trim();

      assert(actual);
      assert.deepStrictEqual(actual, expected);
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
      ['.babelrc.js', '.babelrc.js'],
      ['.editorconfig', '.editorconfig'],
      ['.eslintignore', '.eslintignore'],
      ['.eslintrc.js', '.eslintrc.js'],
      ['.gitattributes', '.gitattributes'],
      ['.gitignore', '.gitignore'],
      ['.huskyrc.js', '.huskyrc.js'],
      ['.lintstagedrc.js', '.lintstagedrc.js']
    ];

    files.forEach((file) => {
      const actual = fs.readFileSync(`${path.dest}/${file[0]}`).toString().trim(),
            expected = fs.readFileSync(`${path.expected}/${file[1]}`).toString().trim();

      assert(actual);
      assert.deepStrictEqual(actual, expected);
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
      ['.babelrc.js', '.babelrc.js'],
      ['.commitlintrc.js', '.commitlintrc.js'],
      ['.editorconfig', '.editorconfig'],
      ['.eslintignore', '.eslintignore'],
      ['.eslintrc.js', '.eslintrc.js'],
      ['.gitattributes', '.gitattributes-conventional-commits'],
      ['.gitignore', '.gitignore'],
      ['.huskyrc.js', '.huskyrc-conventional-commits.js'],
      ['.lintstagedrc.js', '.lintstagedrc.js']
    ];

    files.forEach((file) => {
      const actual = fs.readFileSync(`${path.dest}/${file[0]}`).toString().trim(),
            expected = fs.readFileSync(`${path.expected}/${file[1]}`).toString().trim();

      assert(actual);
      assert.deepStrictEqual(actual, expected);
    });
  });

  it('should generate dot files if argument options.css is true and options.cssPreprocessor is "sass".', async () => {
    await generateDotFiles(path.src, path.dest, {
      css: true,
      html: true,
      image: true,
      js: true,
      server: true,
      sprite: true,
      styleguide: true,
      cssPreprocessor: 'sass'
    });

    const files = [
      ['.babelrc.js', '.babelrc.js'],
      ['.editorconfig', '.editorconfig-sass'],
      ['.eslintignore', '.eslintignore'],
      ['.eslintrc.js', '.eslintrc.js'],
      ['.gitattributes', '.gitattributes-sass'],
      ['.gitignore', '.gitignore-sass'],
      ['.huskyrc.js', '.huskyrc.js'],
      ['.lintstagedrc.js', '.lintstagedrc-sass.js'],
      ['.stylelintignore', '.stylelintignore'],
      ['.stylelintrc.js', '.stylelintrc.js']
    ];

    files.forEach((file) => {
      const actual = fs.readFileSync(`${path.dest}/${file[0]}`).toString().trim(),
            expected = fs.readFileSync(`${path.expected}/${file[1]}`).toString().trim();

      assert(actual);
      assert.deepStrictEqual(actual, expected);
    });
  });

});
