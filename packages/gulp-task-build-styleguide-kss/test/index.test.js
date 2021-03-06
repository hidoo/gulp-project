/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import rimraf from 'rimraf';
import pkg from '../package.json';
import buildStyleguide from '../src';

/**
 * replace version number in license comment
 *
 * @param {String} code target source code
 * @return {String}
 */
function replaceVersion(code = '') {
  return code.replace('<span class="version">(v0.0.0)</span>', `<span class="version">(v${pkg.version})</span>`);
}

describe('gulp-task-build-styleguide-kss', () => {
  const path = {
    src: `${__dirname}/fixtures/src`,
    dest: `${__dirname}/fixtures/dest`,
    expected: `${__dirname}/fixtures/expected`
  };

  afterEach((done) => {
    rimraf(`${path.dest}/**/*.{html,css,js,less}`, done);
  });

  it('should output files to "options.dest" if argument "options" is minimal settings.', (done) => {
    const task = buildStyleguide({
      src: `${path.src}`,
      dest: `${path.dest}`
    });

    task()
      .then(() => {
        const actualIndex = fs.readFileSync(`${path.dest}/index.html`).toString().trim(),
              actualBlock = fs.readFileSync(`${path.dest}/section-block.html`).toString().trim(),
              expectedIndex = replaceVersion(fs.readFileSync(`${path.expected}/minimal/index.html`).toString().trim()),
              expectedBlock = replaceVersion(fs.readFileSync(`${path.expected}/minimal/section-block.html`).toString().trim());

        assert(actualIndex);
        assert(actualBlock);
        assert.deepStrictEqual(actualIndex, expectedIndex);
        assert.deepStrictEqual(actualBlock, expectedBlock);
        done();
      })
      .catch((error) => done(error));
  });

  it('should output files that applied specified markdown contents to "options.dest" if argument "options.homepage" is set.', (done) => {
    const task = buildStyleguide({
      src: `${path.src}`,
      dest: `${path.dest}`,
      homepage: `${path.src}/hoge.md`
    });

    task()
      .then(() => {
        const actualIndex = fs.readFileSync(`${path.dest}/index.html`).toString().trim(),
              actualBlock = fs.readFileSync(`${path.dest}/section-block.html`).toString().trim(),
              expectedIndex = replaceVersion(fs.readFileSync(`${path.expected}/homepage/index.html`).toString().trim()),
              expectedBlock = replaceVersion(fs.readFileSync(`${path.expected}/homepage/section-block.html`).toString().trim());

        assert(actualIndex);
        assert(actualBlock);
        assert.deepStrictEqual(actualIndex, expectedIndex);
        assert.deepStrictEqual(actualBlock, expectedBlock);
        done();
      })
      .catch((error) => done(error));
  });

  it('should output files that loaded specified css or javascript to "options.dest" if argument "options.css" or "options.js" is set.', (done) => {
    const task = buildStyleguide({
      src: `${path.src}`,
      dest: `${path.dest}`,
      css: [
        '//cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css'
      ],
      js: [
        '//cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.10/lodash.core.min.js'
      ]
    });

    task()
      .then(() => {
        const actualIndex = fs.readFileSync(`${path.dest}/index.html`).toString().trim(),
              actualBlock = fs.readFileSync(`${path.dest}/section-block.html`).toString().trim(),
              expectedIndex = replaceVersion(fs.readFileSync(`${path.expected}/css-js/index.html`).toString().trim()),
              expectedBlock = replaceVersion(fs.readFileSync(`${path.expected}/css-js/section-block.html`).toString().trim());

        assert(actualIndex);
        assert(actualBlock);
        assert.deepStrictEqual(actualIndex, expectedIndex);
        assert.deepStrictEqual(actualBlock, expectedBlock);
        done();
      })
      .catch((error) => done(error));
  });

});
