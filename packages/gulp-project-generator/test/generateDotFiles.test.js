/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'node:assert';
import fs from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import generateDotFiles from '../src/generateDotFiles.js';

describe('generateDotFiles', () => {
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
      ['.babelrc.json', '.babelrc.json'],
      ['.editorconfig', '.editorconfig'],
      ['.eslintignore', '.eslintignore'],
      ['.eslintrc.json', '.eslintrc.json'],
      ['.gitattributes', '.gitattributes'],
      ['.gitignore', '.gitignore'],
      ['.husky/pre-commit', '.husky-pre-commit'],
      ['.lintstagedrc.json', '.lintstagedrc.json'],
      ['.mocharc.json', '.mocharc.json']
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
      ['.babelrc.json', '.babelrc.json'],
      ['.editorconfig', '.editorconfig'],
      ['.eslintignore', '.eslintignore'],
      ['.eslintrc.json', '.eslintrc.json'],
      ['.gitattributes', '.gitattributes'],
      ['.gitignore', '.gitignore'],
      ['.husky/pre-commit', '.husky-pre-commit'],
      ['.lintstagedrc.json', '.lintstagedrc.json'],
      ['.mocharc.json', '.mocharc.json']
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
      ['.babelrc.json', '.babelrc.json'],
      ['.commitlintrc.json', '.commitlintrc.json'],
      ['.editorconfig', '.editorconfig'],
      ['.eslintignore', '.eslintignore'],
      ['.eslintrc.json', '.eslintrc.json'],
      ['.gitattributes', '.gitattributes-conventional-commits'],
      ['.gitignore', '.gitignore'],
      ['.husky/commit-msg', '.husky-commit-msg'],
      ['.husky/pre-commit', '.husky-pre-commit'],
      ['.lintstagedrc.json', '.lintstagedrc.json'],
      ['.mocharc.json', '.mocharc.json']
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
      ['.babelrc.json', '.babelrc.json'],
      ['.editorconfig', '.editorconfig-sass'],
      ['.eslintignore', '.eslintignore'],
      ['.eslintrc.json', '.eslintrc.json'],
      ['.gitattributes', '.gitattributes-sass'],
      ['.gitignore', '.gitignore-sass'],
      ['.husky/pre-commit', '.husky-pre-commit'],
      ['.lintstagedrc.json', '.lintstagedrc-sass.json'],
      ['.mocharc.json', '.mocharc.json'],
      ['.stylelintignore', '.stylelintignore'],
      ['.stylelintrc.json', '.stylelintrc.json']
    ];

    files.forEach((file) => {
      const actual = fs.readFileSync(`${path.dest}/${file[0]}`).toString().trim(),
            expected = fs.readFileSync(`${path.expected}/${file[1]}`).toString().trim();

      assert(actual);
      assert.deepStrictEqual(actual, expected);
    });
  });

  it('should generate dot files if argument options.json is false.', async () => {
    await generateDotFiles(path.src, path.dest, {
      css: true,
      html: true,
      image: true,
      js: false,
      server: true,
      sprite: true,
      styleguide: true
    });

    const files = [
      ['.editorconfig', '.editorconfig'],
      ['.eslintignore', '.eslintignore'],
      ['.eslintrc.json', '.eslintrc-no-js.json'],
      ['.gitattributes', '.gitattributes'],
      ['.gitignore', '.gitignore'],
      ['.husky/pre-commit', '.husky-pre-commit'],
      ['.lintstagedrc.json', '.lintstagedrc.json']
    ];

    files.forEach((file) => {
      const actual = fs.readFileSync(`${path.dest}/${file[0]}`).toString().trim(),
            expected = fs.readFileSync(`${path.expected}/${file[1]}`).toString().trim();

      assert(actual);
      assert.deepStrictEqual(actual, expected);
    });
  });

});
