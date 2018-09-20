/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import rimraf from 'rimraf';
import buildJs from '../src';

describe('gulp-task-build-js-browserify', () => {
  const path = {
    src: `${__dirname}/fixtures/src`,
    dest: `${__dirname}/fixtures/dest`,
    expected: `${__dirname}/fixtures/expected`
  };

  afterEach((done) =>
    rimraf(`${path.dest}/*.{js,gz}`, done)
  );

  it('should out to "main.js" if argument "options" is default.', (done) => {
    const task = buildJs({
      src: `${path.src}/main.js`,
      dest: path.dest
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/main.js`),
            expected = fs.readFileSync(`${path.expected}/main.js`);

      assert(actual);
      assert.deepStrictEqual(actual.toString(), expected.toString());
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
      const actual = fs.readFileSync(`${path.dest}/hoge.js`),
            expected = fs.readFileSync(`${path.expected}/main.js`);

      assert(actual);
      assert.deepStrictEqual(actual.toString(), expected.toString());
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
      const actual = fs.readFileSync(`${path.dest}/main.js`).toString().replace(/^[\s\S]*?\*\//m, ''),
            expected = fs.readFileSync(`${path.expected}/main.browsers.js`).toString().replace(/^[\s\S]*?\*\//m, '');

      assert(actual);
      assert.deepStrictEqual(actual, expected);
      done();
    });
  });

  it('should out to "main.js" that transformed without polyfills if argument "options.useBuiltIns" is false.', (done) => {
    const task = buildJs({
      src: `${path.src}/main.js`,
      dest: path.dest,
      useBuiltIns: false
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/main.js`),
            expected = fs.readFileSync(`${path.expected}/main.useBuiltIns.js`);

      assert(actual);
      assert.deepStrictEqual(actual.toString(), expected.toString());
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
      const actual = fs.readFileSync(`${path.dest}/main.js`),
            actualMin = fs.readFileSync(`${path.dest}/main.min.js`),
            actualGz = fs.readFileSync(`${path.dest}/main.min.js.gz`),
            expected = fs.readFileSync(`${path.expected}/main.js`),
            expectedMin = fs.readFileSync(`${path.expected}/main.min.js`);

      assert(actual);
      assert(actualMin);
      assert(actualGz);
      assert.deepStrictEqual(actual.toString(), expected.toString());
      assert.deepStrictEqual(actualMin.toString().trim(), expectedMin.toString().trim());
      done();
    });
  });

});
