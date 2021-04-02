/* eslint max-len: off, no-magic-numbers: off, max-statements: off */

import assert from 'assert';
import fs from 'fs';
import gulp from 'gulp';
import rimraf from 'rimraf';
import buildCss from '../src';

describe('gulp-task-build-css-sass', () => {
  const path = {
    src: `${__dirname}/fixtures/src`,
    dest: `${__dirname}/fixtures/dest`,
    expected: `${__dirname}/fixtures/expected`
  };

  afterEach((done) => {
    rimraf(`${path.dest}/*.{css,gz}`, done);
  });

  it('should out to "main.css" if argument "options" is default.', (done) => {
    const task = buildCss({
      src: `${path.src}/style.scss`,
      dest: path.dest,
      compress: false
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/main.css`);
      const expected = fs.readFileSync(`${path.expected}/main.css`);

      assert(actual);
      assert.deepStrictEqual(String(actual).trim(), String(expected).trim());
      done();
    });
  });

  it('should out to specified file name if argument "options.filename" is set.', (done) => {
    const task = buildCss({
      src: `${path.src}/style.scss`,
      dest: path.dest,
      filename: 'hoge.css',
      compress: false
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/hoge.css`);
      const expected = fs.readFileSync(`${path.expected}/main.css`);

      assert(actual);
      assert.deepStrictEqual(String(actual).trim(), String(expected).trim());
      done();
    });
  });

  it('should out to "main.css" that applied vendor-prefix for target browsers if argument "options.browsers" is set.', (done) => {
    const task = buildCss({
      src: `${path.src}/style.scss`,
      dest: path.dest,
      browsers: ['android >= 2.3'],
      compress: false
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/main.css`);
      const expected = fs.readFileSync(`${path.expected}/main.browsers.css`);

      assert(actual);
      assert.deepStrictEqual(String(actual).trim(), String(expected).trim());
      done();
    });
  });

  it('should out to "main.css" that applied vendor-prefix for target browsers if argument "options.targets" is set.', (done) => {
    const task = buildCss({
      src: `${path.src}/style.scss`,
      dest: path.dest,
      targets: ['android >= 2.3'],
      compress: false
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/main.css`);
      const expected = fs.readFileSync(`${path.expected}/main.browsers.css`);

      assert(actual);
      assert.deepStrictEqual(String(actual).trim(), String(expected).trim());
      done();
    });
  });

  it('should out to "main.min.css" and "main.min.css.gz" if argument "options.compress" is set.', (done) => {
    const task = buildCss({
      src: `${path.src}/style.scss`,
      dest: path.dest,
      compress: true
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/main.css`);
      const actualMin = fs.readFileSync(`${path.dest}/main.min.css`);
      const actualGz = fs.readFileSync(`${path.dest}/main.min.css.gz`);
      const expected = fs.readFileSync(`${path.expected}/main.css`);
      const expectedMin = fs.readFileSync(`${path.expected}/main.min.css`);

      assert(actual);
      assert(actualMin);
      assert(actualGz);
      assert.deepStrictEqual(String(actual).trim(), String(expected).trim());
      assert.deepStrictEqual(String(actualMin).trim(), String(expectedMin).trim());
      done();
    });
  });

  it('should out to "main.hoge.css" and "main.hoge.css.gz" if argument "options.compress" is true and argument "options.suffix" is ".hoge".', (done) => {
    const task = buildCss({
      src: `${path.src}/style.scss`,
      dest: path.dest,
      suffix: '.hoge',
      compress: true
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/main.css`);
      const actualMin = fs.readFileSync(`${path.dest}/main.hoge.css`);
      const actualGz = fs.readFileSync(`${path.dest}/main.hoge.css.gz`);
      const expected = fs.readFileSync(`${path.expected}/main.css`);
      const expectedMin = fs.readFileSync(`${path.expected}/main.min.css`);

      assert(actual);
      assert(actualMin);
      assert(actualGz);
      assert.deepStrictEqual(String(actual).trim(), String(expected).trim());
      assert.deepStrictEqual(String(actualMin).trim(), String(expectedMin).trim());
      done();
    });
  });

  it('should out to "main.css" and "main.css.gz" if argument "options.compress" is true and argument "options.suffix" is empty string.', (done) => {
    const task = buildCss({
      src: `${path.src}/style.scss`,
      dest: path.dest,
      suffix: '',
      compress: true
    });

    task().on('finish', () => {
      const actualMin = fs.readFileSync(`${path.dest}/main.css`);
      const actualGz = fs.readFileSync(`${path.dest}/main.css.gz`);
      const expectedMin = fs.readFileSync(`${path.expected}/main.min.css`);

      assert(actualMin);
      assert(actualGz);
      assert.deepStrictEqual(String(actualMin).trim(), String(expectedMin).trim());
      done();
    });
  });

  it('should out to "main.css" that not process url() value if argument "options.url" is not set.', (done) => {
    const task = buildCss({
      src: `${path.src}/style.url.scss`,
      dest: path.dest,
      compress: false
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/main.css`);
      const expected = fs.readFileSync(`${path.expected}/main.url-not-set.css`);

      assert(actual);
      assert.deepStrictEqual(String(actual).trim(), String(expected).trim());
      done();
    });
  });

  it('should out to "main.css" that embed url() value if argument "options.url" is "inline".', (done) => {
    const task = buildCss({
      src: `${path.src}/style.url.scss`,
      dest: path.dest,
      url: 'inline',
      compress: false
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/main.css`);
      const expected = fs.readFileSync(`${path.expected}/main.url.css`);

      assert(actual);
      assert.deepStrictEqual(String(actual).trim(), String(expected).trim());
      done();
    });
  });

  it('should out to "main.css" that embed url() value with options if argument "options.url" is "inline" and argument.urlOptions is set.', (done) => {
    const task = buildCss({
      src: `${path.src}/style.url.scss`,
      dest: path.dest,
      url: 'inline',
      urlOptions: {encodeType: 'base64'},
      compress: false
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/main.css`);
      const expected = fs.readFileSync(`${path.expected}/main.url-options.css`);

      assert(actual);
      assert.deepStrictEqual(String(actual).trim(), String(expected).trim());
      done();
    });
  });

  it('should out to "main.css" that injected specified value if argument "options.banner" is set.', (done) => {
    const task = buildCss({
      src: `${path.src}/style.scss`,
      dest: path.dest,
      banner: '/*! copyright <%= pkg.author %> */\n',
      compress: false
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/main.css`);
      const expected = fs.readFileSync(`${path.expected}/main.banner.css`);

      assert(actual);
      assert.deepStrictEqual(String(actual).trim(), String(expected).trim());
      done();
    });
  });

  it('should out to "main.css" that removed unused CSS if argument "options.uncssTargets" is set.', (done) => {
    const task = buildCss({
      src: `${path.src}/style.scss`,
      dest: path.dest,
      uncssTargets: [`${path.src}/target.html`],
      compress: false
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/main.css`);
      const expected = fs.readFileSync(`${path.expected}/main.remove-unused.css`);

      assert(actual);
      assert.deepStrictEqual(String(actual).trim(), String(expected).trim());
      done();
    });
  });

  it('should out to "main.css" that applied specified process CSS if argument "options.additionalProcess" is set.', (done) => {
    const task = buildCss({
      src: `${path.src}/style.scss`,
      dest: path.dest,
      additionalProcess(root) {
        root.walkRules(/\.block/, (rule) => {
          rule.selectors = rule.selectors.map(
            (selector) => selector.trim().replace(/\.block/, '.hoge')
          );
        });

        return root;
      },
      compress: false
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/main.css`);
      const expected = fs.readFileSync(`${path.expected}/main.post-process.css`);

      assert(actual);
      assert.deepStrictEqual(String(actual).trim(), String(expected).trim());
      done();
    });
  });

  it('should not stop process if throw error.', (done) => {
    const task = buildCss({
      src: `${path.src}/error.scss`,
      dest: path.dest,
      compress: false
    });

    task().on('finish', done);
  });

  it('should call next task after files were outputted in gulp.series.', (done) => {
    const task = buildCss({
      src: `${path.src}/style.scss`,
      dest: path.dest,
      compress: false
    });

    const build = gulp.series(
      task,
      (cb) => {
        const actual = fs.readFileSync(`${path.dest}/main.css`);
        const expected = fs.readFileSync(`${path.expected}/main.css`);

        assert(actual);
        assert.deepStrictEqual(String(actual).trim(), String(expected).trim());
        cb();
        done();
      }
    );

    build();
  });

});
