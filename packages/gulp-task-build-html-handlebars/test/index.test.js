/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import rimraf from 'rimraf';
import buildHtml from '../src';

describe('gulp-task-build-html-handlebars', () => {
  const path = {
    src: `${__dirname}/fixtures/src`,
    dest: `${__dirname}/fixtures/dest`,
    expected: `${__dirname}/fixtures/expected`
  };

  afterEach((done) =>
    rimraf(`${path.dest}/*.{html,php}`, done)
  );

  it('should out to "options.dest" if argument "options" is default.', (done) => {
    const task = buildHtml({
      src: `${path.src}/index.hbs`,
      dest: path.dest
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/index.html`),
            expected = fs.readFileSync(`${path.expected}/index.html`);

      assert(actual);
      assert.equal(String(actual).trim(), String(expected).trim());
      done();
    });
  });

  it('should out to "options.dest" that applied extname if argument "options.extname" is ".php"', (done) => {
    const task = buildHtml({
      src: `${path.src}/index.hbs`,
      dest: path.dest,
      extname: '.php'
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/index.php`),
            expected = fs.readFileSync(`${path.expected}/index.html`);

      assert(actual);
      assert.equal(String(actual).trim(), String(expected).trim());
      done();
    });
  });

  it('should out to "options.dest" that applied minify if argument "options.compress" is true', (done) => {
    const task = buildHtml({
      src: `${path.src}/index.hbs`,
      dest: path.dest,
      compress: true
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/index.html`),
            expected = fs.readFileSync(`${path.expected}/index.compress.html`);

      assert(actual);
      assert.equal(String(actual).trim(), String(expected).trim());
      done();
    });
  });

  it('should out to "options.dest" that applied partial if argument "options.partials" is set.', (done) => {
    const task = buildHtml({
      src: `${path.src}/index.partial.hbs`,
      dest: path.dest,
      partials: `${path.src}/partials/**/*.hbs`
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/index.partial.html`),
            expected = fs.readFileSync(`${path.expected}/index.partial.html`);

      assert(actual);
      assert.equal(String(actual).trim(), String(expected).trim());
      done();
    });
  });

  it('should out to "options.dest" that applied layout if argument "options.layouts" is set.', (done) => {
    const task = buildHtml({
      src: `${path.src}/index.layouts.hbs`,
      dest: path.dest,
      layouts: `${path.src}/layouts/**/*.hbs`
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/index.layouts.html`),
            expected = fs.readFileSync(`${path.expected}/index.layouts.html`);

      assert(actual);
      assert.equal(String(actual).trim(), String(expected).trim());
      done();
    });
  });

  it('should out to "options.dest" that applied helper if argument "options.helpers" is set.', (done) => {
    const task = buildHtml({
      src: `${path.src}/index.helpers.hbs`,
      dest: path.dest,
      helpers: `${path.src}/helpers/**/*.js`
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/index.helpers.html`),
            expected = fs.readFileSync(`${path.expected}/index.helpers.html`);

      assert(actual);
      assert.equal(String(actual).trim(), String(expected).trim());
      done();
    });
  });

  it('should out to "options.dest" that applied data if argument "options.data" is set.', (done) => {
    const task = buildHtml({
      src: `${path.src}/index.data.hbs`,
      dest: path.dest,
      data: `${path.src}/data/**/valid.yml`
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/index.data.html`),
            expected = fs.readFileSync(`${path.expected}/index.data.html`);

      assert(actual);
      assert.equal(String(actual).trim(), String(expected).trim());
      done();
    });
  });

  it('should out to "options.dest" that applied data if argument "options.data" and argumet "onFilesParsed" are set.', (done) => {
    const task = buildHtml({
      src: `${path.src}/index.data.hbs`,
      dest: path.dest,
      data: `${path.src}/data/**/valid.yml`,
      onFilesParsed: (data) => {
        if (data.data && data.data.site && data.data.site.title && data.data.site.description) {
          data.data.site = {
            title: 'hoge',
            description: 'fuga.'
          };
        }
        return data;
      }
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/index.data.html`),
            expected = fs.readFileSync(`${path.expected}/index.on-data-files-parsed.html`);

      assert(actual);
      assert.equal(String(actual).trim(), String(expected).trim());
      done();
    });
  });

  it('should out to "options.dest" that applied data if argument "options.data" is invalid file set.', (done) => {
    const task = buildHtml({
      src: `${path.src}/index.data.hbs`,
      dest: path.dest,
      data: `${path.src}/data/**/invalid.yml`,
      verbose: false
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/index.data.html`),
            expected = fs.readFileSync(`${path.expected}/index.data.invalid.html`);

      assert(actual);
      assert.equal(String(actual).trim(), String(expected).trim());
      done();
    });
  });

  it('should out to "options.dest" that applied data if argumet "onFrontMatterParsed" is set.', (done) => {
    const task = buildHtml({
      src: `${path.src}/index.hbs`,
      dest: path.dest,
      onFrontMatterParsed: (data) => {
        if (data.seo && data.seo.title && data.seo.description) {
          data.seo = {
            title: 'hoge',
            description: 'fuga.'
          };
        }
        return data;
      }
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/index.html`),
            expected = fs.readFileSync(`${path.expected}/index.on-front-matter-parsed.html`);

      assert(actual);
      assert.equal(String(actual).trim(), String(expected).trim());
      done();
    });
  });

  it('should out files to "options.dest" that includes all pages front matter data.', (done) => {
    const task = buildHtml({
      src: `${path.src}/index*.hbs`,
      dest: path.dest,
      partials: `${path.src}/partials/**/*.hbs`,
      layouts: `${path.src}/layouts/**/*.hbs`,
      helpers: `${path.src}/helpers/**/*.js`,
      data: `${path.src}/data/**/valid.yml`
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/index.pages.html`),
            expected = fs.readFileSync(`${path.expected}/index.pages.html`);

      assert(actual);
      assert.equal(String(actual).trim(), String(expected).trim());
      done();
    });
  });

  it('should out files to "options.dest" that includes file data as "this.path".', (done) => {
    const task = buildHtml({
      src: `${path.src}/file.hbs`,
      dest: path.dest
    });

    task().on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/file.html`),
            expected = fs.readFileSync(`${path.expected}/file.html`);

      assert(actual);
      assert.equal(String(actual).trim(), String(expected).trim());
      done();
    });
  });

});
