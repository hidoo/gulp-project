/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import rimraf from 'rimraf';
import pkg from '../package.json';
import buildJs from '../src';

/**
 * replace version number in license comment
 *
 * @param {String} code target source code
 * @return {String}
 */
function replaceVersion(code = '') {
  return code.replace(' *   version: 0.0.0', ` *   version: ${pkg.version}`);
}

describe('gulp-task-build-js-browserify', () => {
  const path = {
    src: `${__dirname}/fixtures/src`,
    dest: `${__dirname}/fixtures/dest`,
    expected: `${__dirname}/fixtures/expected`
  };

  afterEach((done) => {
    rimraf(`${path.dest}/*.{js,gz}`, done);
  });

  it('should out to "main.js" if argument "options" is default.', (done) => {
    const task = buildJs({
      src: `${path.src}/main.js`,
      dest: path.dest
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/main.js`).toString().trim(),
            expected = replaceVersion(fs.readFileSync(`${path.expected}/main.js`).toString().trim());

      assert(actual);
      assert.deepStrictEqual(actual, expected);
      done();
    });
  });

  it('should out to specified file name if argument "options.filename" is set.', (done) => {
    const task = buildJs({
      src: `${path.src}/main.js`,
      dest: path.dest,
      filename: 'hoge.js'
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/hoge.js`).toString().trim(),
            expected = replaceVersion(fs.readFileSync(`${path.expected}/main.js`).toString().trim());

      assert(actual);
      assert.deepStrictEqual(actual, expected);
      done();
    });
  });

  it('should out to "main.js" that transformed for target browsers if argument "options.browsers" is set.', (done) => {
    const task = buildJs({
      src: `${path.src}/main.js`,
      dest: path.dest,
      browsers: ['> 0.1% in JP', 'ie >= 8']
    });

    task().on('finish', () => {
      // remove license comment before compare source code (for travis CI)
      const actual = fs.readFileSync(`${path.dest}/main.js`).toString().trim().replace(/^[\s\S]*?\*\//m, ''),
            expected = fs.readFileSync(`${path.expected}/main.browsers.js`).toString().trim().replace(/^[\s\S]*?\*\//m, '');

      assert(actual);
      assert.deepStrictEqual(actual, expected);
      done();
    });
  });

  it('should out to "main.js" that transformed without polyfills if argument "options.useBuiltIns" is false.', (done) => {
    const task = buildJs({
      src: `${path.src}/main.js`,
      dest: path.dest,
      browsers: ['> 0.1% in JP', 'ie >= 8'],
      useBuiltIns: false
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/main.js`).toString().trim(),
            expected = replaceVersion(fs.readFileSync(`${path.expected}/main.useBuiltIns.js`).toString().trim());

      assert(actual);
      assert.deepStrictEqual(actual, expected);
      done();
    });
  });

  it('should out to "main.js" that polyfilled by specified version of core-js if argument "options.corejs" is set.', (done) => {
    const task = buildJs({
      src: `${path.src}/main.js`,
      dest: path.dest,
      browsers: ['> 0.1% in JP', 'ie >= 8'],
      corejs: 2
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/main.js`).toString().trim(),
            expected = replaceVersion(fs.readFileSync(`${path.expected}/main.corejs.js`).toString().trim());

      assert(actual);
      assert.deepStrictEqual(actual, expected);
      done();
    });
  });

  it('should out to "main.min.js" and "main.min.js.gz" if argument "options.compress" is set.', (done) => {
    const task = buildJs({
      src: `${path.src}/main.js`,
      dest: path.dest,
      compress: true
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/main.js`).toString().trim(),
            actualMin = fs.readFileSync(`${path.dest}/main.min.js`).toString().trim(),
            actualGz = fs.readFileSync(`${path.dest}/main.min.js.gz`),
            expected = replaceVersion(fs.readFileSync(`${path.expected}/main.js`).toString().trim()),
            expectedMin = replaceVersion(fs.readFileSync(`${path.expected}/main.min.js`).toString().trim());

      assert(actual);
      assert(actualMin);
      assert(actualGz);
      assert.deepStrictEqual(actual, expected);
      assert.deepStrictEqual(actualMin, expectedMin);
      done();
    });
  });

  it('should out to "main.hoge.js" and "main.hoge.js.gz" if argument "options.compress" is set and argument "options.suffix" is ".hoge".', (done) => {
    const task = buildJs({
      src: `${path.src}/main.js`,
      dest: path.dest,
      suffix: '.hoge',
      compress: true
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/main.js`).toString().trim(),
            actualMin = fs.readFileSync(`${path.dest}/main.hoge.js`).toString().trim(),
            actualGz = fs.readFileSync(`${path.dest}/main.hoge.js.gz`),
            expected = replaceVersion(fs.readFileSync(`${path.expected}/main.js`).toString().trim()),
            expectedMin = replaceVersion(fs.readFileSync(`${path.expected}/main.min.js`).toString().trim());

      assert(actual);
      assert(actualMin);
      assert(actualGz);
      assert.deepStrictEqual(actual, expected);
      assert.deepStrictEqual(actualMin, expectedMin);
      done();
    });
  });

  it('should out to "main.js" and "main.js.gz" if argument "options.compress" is set and argument "options.suffix" is empty string.', (done) => {
    const task = buildJs({
      src: `${path.src}/main.js`,
      dest: path.dest,
      suffix: '',
      compress: true
    });

    task().on('finish', () => {
      const actualMin = fs.readFileSync(`${path.dest}/main.js`).toString().trim(),
            actualGz = fs.readFileSync(`${path.dest}/main.js.gz`),
            expectedMin = replaceVersion(fs.readFileSync(`${path.expected}/main.min.js`).toString().trim());

      assert(actualMin);
      assert(actualGz);
      assert.deepStrictEqual(actualMin, expectedMin);
      done();
    });
  });

});
