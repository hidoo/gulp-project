/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import rimraf from 'rimraf';
import buildCss from '../src';

describe('gulp-task-build-css-stylus', () => {
  const path = {
    src: `${__dirname}/fixtures/src`,
    dest: `${__dirname}/fixtures/dest`,
    expected: `${__dirname}/fixtures/expected`
  };

  afterEach((done) =>
    rimraf(`${path.dest}/*.{css,gz}`, done)
  );

  it('should out to "main.css" if argument "options" is default.', (done) => {
    const task = buildCss({
      src: `${path.src}/style.styl`,
      dest: path.dest,
      compress: false
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/main.css`),
            expected = fs.readFileSync(`${path.expected}/main.css`);

      assert(actual);
      assert.equal(String(actual), String(expected));
      done();
    });
  });

  it('should out to specified file name if argument "options.filename" is set.', (done) => {
    const task = buildCss({
      src: `${path.src}/style.styl`,
      dest: path.dest,
      filename: 'hoge.css',
      compress: false
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/hoge.css`),
            expected = fs.readFileSync(`${path.expected}/main.css`);

      assert(actual);
      assert.equal(String(actual), String(expected));
      done();
    });
  });

  it('should out to "main.css" that applied vendor-prefix for target browsers if argument "options.browsers" is set.', (done) => {
    const task = buildCss({
      src: `${path.src}/style.styl`,
      dest: path.dest,
      browsers: ['> 0.1% in JP'],
      compress: false
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/main.css`),
            expected = fs.readFileSync(`${path.expected}/main.browsers.css`);

      assert(actual);
      assert.equal(String(actual), String(expected));
      done();
    });
  });

  it('should out to "main.min.css" and "main.min.css.gz" if argument "options.compress" is set.', (done) => {
    const task = buildCss({
      src: `${path.src}/style.styl`,
      dest: path.dest,
      compress: true
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/main.css`),
            actualMin = fs.readFileSync(`${path.dest}/main.min.css`),
            actualGz = fs.readFileSync(`${path.dest}/main.min.css.gz`),
            expected = fs.readFileSync(`${path.expected}/main.css`),
            expectedMin = fs.readFileSync(`${path.expected}/main.min.css`);

      assert(actual);
      assert(actualMin);
      assert(actualGz);
      assert.equal(String(actual), String(expected));
      assert.equal(String(actualMin).trim(), String(expectedMin).trim());
      done();
    });
  });

  it('should out to "main.hoge.css" and "main.hoge.css.gz" if argument "options.compress" is true and argument "options.suffix" is ".hoge".', (done) => {
    const task = buildCss({
      src: `${path.src}/style.styl`,
      dest: path.dest,
      suffix: '.hoge',
      compress: true
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/main.css`),
            actualMin = fs.readFileSync(`${path.dest}/main.hoge.css`),
            actualGz = fs.readFileSync(`${path.dest}/main.hoge.css.gz`),
            expected = fs.readFileSync(`${path.expected}/main.css`),
            expectedMin = fs.readFileSync(`${path.expected}/main.min.css`);

      assert(actual);
      assert(actualMin);
      assert(actualGz);
      assert.equal(String(actual), String(expected));
      assert.equal(String(actualMin).trim(), String(expectedMin).trim());
      done();
    });
  });

  it('should out to "main.css" and "main.css.gz" if argument "options.compress" is true and argument "options.suffix" is empty string.', (done) => {
    const task = buildCss({
      src: `${path.src}/style.styl`,
      dest: path.dest,
      suffix: '',
      compress: true
    });

    task().on('finish', () => {
      const actualMin = fs.readFileSync(`${path.dest}/main.css`),
            actualGz = fs.readFileSync(`${path.dest}/main.css.gz`),
            expectedMin = fs.readFileSync(`${path.expected}/main.min.css`);

      assert(actualMin);
      assert(actualGz);
      assert.equal(String(actualMin).trim(), String(expectedMin).trim());
      done();
    });
  });

  it('should out to "main.css" that injected specified value if argument "options.banner" is set.', (done) => {
    const task = buildCss({
      src: `${path.src}/style.styl`,
      dest: path.dest,
      banner: '/*! copyright <%= pkg.author %> */\n',
      compress: false
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/main.css`),
            expected = fs.readFileSync(`${path.expected}/main.banner.css`);

      assert(actual);
      assert.equal(String(actual), String(expected));
      done();
    });
  });

  it('should out to "main.css" that removed unused CSS if argument "options.uncssTargets" is set.', (done) => {
    const task = buildCss({
      src: `${path.src}/style.styl`,
      dest: path.dest,
      uncssTargets: [`${path.src}/target.html`],
      compress: false
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/main.css`),
            expected = fs.readFileSync(`${path.expected}/main.remove-unused.css`);

      assert(actual);
      assert.equal(String(actual), String(expected));
      done();
    });
  });

  it('should out to "main.css" that applied specified process CSS if argument "options.additionalProcess" is set.', (done) => {
    const task = buildCss({
      src: `${path.src}/style.styl`,
      dest: path.dest,
      additionalProcess: (root) => {
        root.walkRules(/\.block/, (rule) => {
          rule.selectors = rule.selectors.map((selector) =>
            selector.trim().replace(/\.block/, '.hoge')
          );
        });

        return root;
      },
      compress: false
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/main.css`),
            expected = fs.readFileSync(`${path.expected}/main.post-process.css`);

      assert(actual);
      assert.equal(String(actual), String(expected));
      done();
    });
  });

});
