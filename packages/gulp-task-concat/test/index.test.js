/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import rimraf from 'rimraf';
import {concatJs, concatCss} from '../src';

describe('gulp-task-concat', () => {
  const path = {
    src: `${__dirname}/fixtures/src`,
    dest: `${__dirname}/fixtures/dest`,
    expected: `${__dirname}/fixtures/expected`
  };

  afterEach((done) =>
    rimraf(`${path.dest}/*.{js,css,gz}`, done)
  );

  it('should out to "bundle.js" if argument "options" is default.', (done) => {
    const task = concatJs({
      src: [
        `${path.src}/a.js`,
        `${path.src}/c.js`,
        `${path.src}/b.js`
      ],
      dest: path.dest
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/bundle.js`),
            expected = fs.readFileSync(`${path.expected}/bundle.default.js`);

      assert(actual);
      assert.deepStrictEqual(actual.toString().trim(), expected.toString().trim());
      done();
    });
  });

  it('should out to specified filename if argument "options.filename" is set.', (done) => {
    const task = concatJs({
      src: [
        `${path.src}/a.js`,
        `${path.src}/c.js`,
        `${path.src}/b.js`
      ],
      dest: path.dest,
      filename: 'hoge.js'
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/hoge.js`),
            expected = fs.readFileSync(`${path.expected}/bundle.filename.js`);

      assert(actual);
      assert.deepStrictEqual(actual.toString().trim(), expected.toString().trim());
      done();
    });
  });

  it('should out to file that applied specified banner if argument "options.banner" is set.', (done) => {
    const task = concatJs({
      src: [
        `${path.src}/a.js`,
        `${path.src}/c.js`,
        `${path.src}/b.js`
      ],
      dest: path.dest,
      banner: '/* copyright <%= pkg.author %> */\n'
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/bundle.js`),
            expected = fs.readFileSync(`${path.expected}/bundle.banner.js`);

      assert(actual);
      assert.deepStrictEqual(actual.toString().trim(), expected.toString().trim());
      done();
    });
  });

  it('should out to compressed file if argument "options.compress" is true.', (done) => {
    const task = concatJs({
      src: [
        `${path.src}/a.js`,
        `${path.src}/c.js`,
        `${path.src}/b.js`
      ],
      dest: path.dest,
      compress: true
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/bundle.js`),
            actualMin = fs.readFileSync(`${path.dest}/bundle.min.js`),
            actualGz = fs.readFileSync(`${path.dest}/bundle.min.js.gz`),
            expected = fs.readFileSync(`${path.expected}/bundle.compress.js`),
            expectedMin = fs.readFileSync(`${path.expected}/bundle.compress.min.js`),
            expectedGz = fs.readFileSync(`${path.expected}/bundle.compress.min.js.gz`);

      assert(actual);
      assert(actualMin);
      assert(actualGz);
      assert.deepStrictEqual(actual.toString().trim(), expected.toString().trim());
      assert.deepStrictEqual(actualMin.toString().trim(), expectedMin.toString().trim());
      assert.deepStrictEqual(actualGz, expectedGz);
      done();
    });
  });

  it('should out to "bundle.css" if argument "options" is default.', (done) => {
    const task = concatCss({
      src: [
        `${path.src}/a.css`,
        `${path.src}/c.css`,
        `${path.src}/b.css`
      ],
      dest: path.dest
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/bundle.css`),
            expected = fs.readFileSync(`${path.expected}/bundle.default.css`);

      assert(actual);
      assert.deepStrictEqual(actual.toString().trim(), expected.toString().trim());
      done();
    });
  });

  it('should out to specified filename if argument "options.filename" is set.', (done) => {
    const task = concatCss({
      src: [
        `${path.src}/a.css`,
        `${path.src}/c.css`,
        `${path.src}/b.css`
      ],
      dest: path.dest,
      filename: 'hoge.css'
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/hoge.css`),
            expected = fs.readFileSync(`${path.expected}/bundle.filename.css`);

      assert(actual);
      assert.deepStrictEqual(actual.toString().trim(), expected.toString().trim());
      done();
    });
  });

  it('should out to file that applied specified banner if argument "options.banner" is set.', (done) => {
    const task = concatCss({
      src: [
        `${path.src}/a.css`,
        `${path.src}/c.css`,
        `${path.src}/b.css`
      ],
      dest: path.dest,
      banner: '/* copyright <%= pkg.author %> */\n'
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/bundle.css`),
            expected = fs.readFileSync(`${path.expected}/bundle.banner.css`);

      assert(actual);
      assert.deepStrictEqual(actual.toString().trim(), expected.toString().trim());
      done();
    });
  });

  it('should out to compressed file if argument "options.compress" is true.', (done) => {
    const task = concatCss({
      src: [
        `${path.src}/a.css`,
        `${path.src}/c.css`,
        `${path.src}/b.css`
      ],
      dest: path.dest,
      compress: true
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/bundle.css`),
            actualMin = fs.readFileSync(`${path.dest}/bundle.min.css`),
            actualGz = fs.readFileSync(`${path.dest}/bundle.min.css.gz`),
            expected = fs.readFileSync(`${path.expected}/bundle.compress.css`),
            expectedMin = fs.readFileSync(`${path.expected}/bundle.compress.min.css`),
            expectedGz = fs.readFileSync(`${path.expected}/bundle.compress.min.css.gz`);

      assert(actual);
      assert(actualMin);
      assert(actualGz);
      assert.deepStrictEqual(actual.toString().trim(), expected.toString().trim());
      assert.deepStrictEqual(actualMin.toString().trim(), expectedMin.toString().trim());
      assert.deepStrictEqual(actualGz, expectedGz);
      done();
    });
  });

});
