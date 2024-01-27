/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'node:assert';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import generatePackageJson from '../src/generatePackageJson.js';

describe('generatePackageJson', () => {
  const require = createRequire(import.meta.url);
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const pkg = require('../package.json');
  const path = {
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
    const actual = generatePackageJson('hoge-project', path.dest, {});

    assert(actual instanceof Promise);
    actual.then(() => done());
  });

  it('should generate package.json.', async () => {
    await generatePackageJson('hoge-project', path.dest, {
      css: true,
      cssDeps: true,
      html: true,
      image: true,
      js: true,
      jsDeps: true,
      server: true,
      sprite: true,
      styleguide: true,
      jsBundler: 'browserify',
      spriteType: 'svg'
    });

    const actual = fs.readFileSync(`${path.dest}/package.json`).toString().trim(),
          expected = fs.readFileSync(`${path.expected}/package.json`).toString().trim().replace(/\^0.0.0/g, `^${pkg.version}`);

    assert(actual);
    assert.deepStrictEqual(actual, expected);
  });

  it('should generate package.json if argument options.conventionalCommits is true.', async () => {
    await generatePackageJson('hoge-project', path.dest, {
      css: true,
      cssDeps: true,
      html: true,
      image: true,
      js: true,
      jsDeps: true,
      server: true,
      sprite: true,
      styleguide: true,
      jsBundler: 'browserify',
      spriteType: 'svg',
      conventionalCommits: true
    });

    const actual = fs.readFileSync(`${path.dest}/package.json`).toString().trim(),
          expected = fs.readFileSync(`${path.expected}/package-conventional-commits.json`).toString().trim().replace(/\^0.0.0/g, `^${pkg.version}`);

    assert(actual);
    assert.deepStrictEqual(actual, expected);
  });

  it('should generate package.json if argument options.css is true and options.cssPreprocessor is "sass".', async () => {
    await generatePackageJson('hoge-project', path.dest, {
      css: true,
      cssDeps: true,
      html: true,
      image: true,
      js: true,
      jsDeps: true,
      server: true,
      sprite: true,
      styleguide: true,
      jsBundler: 'browserify',
      spriteType: 'svg',
      cssPreprocessor: 'sass'
    });

    const actual = fs.readFileSync(`${path.dest}/package.json`).toString().trim(),
          expected = fs.readFileSync(`${path.expected}/package-sass.json`).toString().trim().replace(/\^0.0.0/g, `^${pkg.version}`);

    assert(actual);
    assert.deepStrictEqual(actual, expected);
  });

});
