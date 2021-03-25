/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import {resolve} from 'path';
import rimraf from 'rimraf';
import pkg from '../package.json';
import buildJs from '../src';

/**
 * replace version number in source code
 *
 * @param {String} code target source code
 * @return {String}
 */
function replaceVersion(code = '') {
  return code
    .replace(/<core-js version>/g, pkg.devDependencies['core-js'])
    .replace(/<pkg version>/g, pkg.version);
}

describe('gulp-task-build-js-rollup', () => {
  const path = {
    src: `${__dirname}/fixtures/src`,
    dest: `${__dirname}/fixtures/dest`,
    expected: `${__dirname}/fixtures/expected`
  };

  afterEach((done) => {
    rimraf(`${path.dest}/*.{js,gz}`, done);
  });

  it('should out to "main.js" if argument "options" is default.', async () => {
    const task = buildJs({
      src: `${path.src}/main.js`,
      dest: path.dest
    });
    const stream = await task();

    await new Promise((done) => stream.on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/main.js`).toString().trim(),
            expected = replaceVersion(fs.readFileSync(`${path.expected}/main.js`).toString().trim());

      assert(actual);
      assert.deepStrictEqual(actual, expected);
      done();
    }));
  });

  it('should out to specified file name if argument "options.filename" is set.', async () => {
    const task = buildJs({
      src: `${path.src}/main.js`,
      dest: path.dest,
      filename: 'hoge.js'
    });
    const stream = await task();

    await new Promise((done) => stream.on('finish', () => {
      const actual = fs.readFileSync(`${path.dest}/hoge.js`).toString().trim(),
            expected = replaceVersion(fs.readFileSync(`${path.expected}/main.js`).toString().trim());

      assert(actual);
      assert.deepStrictEqual(actual, expected);
      done();
    }));
  });

  it('should out to "main.js" that transformed for target browsers if argument "options.browsers" is set.', (done) => {
    const task = buildJs({
      src: `${path.src}/main.js`,
      dest: path.dest,
      filename: 'main.browsers.js',
      browsers: 'chrome >= 50'
    });

    task()
      .then((stream) => stream.on('finish', () => {
        const actual = fs.readFileSync(`${path.dest}/main.browsers.js`).toString().trim(),
              expected = replaceVersion(fs.readFileSync(`${path.expected}/main.browsers.js`).toString().trim());

        assert(actual);
        assert.deepStrictEqual(actual, expected);
        done();
      }))
      .catch((error) => done(error));
  });

  it('should out to "use-corejs.js" that polyfilled by specified options of core-js if argument "options.corejs" is set.', (done) => {
    const task = buildJs({
      src: `${path.src}/use-corejs.js`,
      dest: path.dest,
      filename: 'use-corejs.js',
      browsers: 'ie >= 11',
      corejs: {version: 3, proposals: true}
    });

    task()
      .then((stream) => stream.on('finish', () => {
        const actual = fs.readFileSync(`${path.dest}/use-corejs.js`).toString().trim(),
              expected = replaceVersion(fs.readFileSync(`${path.expected}/use-corejs.js`).toString().trim());

        assert(actual);
        assert.deepStrictEqual(actual, expected);
        done();
      }))
      .catch((error) => done(error));
  });

  it('should out to "use-react.js" that transformed for jsx if @babel/preset-react use.', (done) => {
    const task = buildJs({
      src: `${path.src}/use-react.js`,
      dest: path.dest,
      filename: 'use-react.js',
      babelrc: resolve(process.cwd(), `${__dirname}/fixtures/src/use-react.babelrc.js`)
    });

    task()
      .then((stream) => stream.on('finish', () => {
        const actual = fs.readFileSync(`${path.dest}/use-react.js`).toString().trim(),
              expected = replaceVersion(fs.readFileSync(`${path.expected}/use-react.js`).toString().trim());

        assert(actual);
        assert.deepStrictEqual(actual, expected);
        done();
      }))
      .catch((error) => done(error));
  });

  it('should out to "import-json.js" that convert JSON to ES6 modules if ".json" files import.', (done) => {
    const task = buildJs({
      src: `${path.src}/import-json.js`,
      dest: path.dest,
      filename: 'import-json.js'
    });

    task()
      .then((stream) => stream.on('finish', () => {
        const actual = fs.readFileSync(`${path.dest}/import-json.js`).toString().trim(),
              expected = replaceVersion(fs.readFileSync(`${path.expected}/import-json.js`).toString().trim());

        assert(actual);
        assert.deepStrictEqual(actual, expected);
        done();
      }))
      .catch((error) => done(error));
  });

  it('should out to "alias.js" that resolved modules by alias if options.aliasOptions is set.', (done) => {
    const task = buildJs({
      src: `${path.src}/child/grand-child/alias.js`,
      dest: path.dest,
      filename: 'alias.js',
      aliasOptions: {
        entries: [
          {
            find: '~',
            replacement: `${resolve(path.src)}`
          }
        ]
      }
    });

    task()
      .then((stream) => stream.on('finish', () => {
        const actual = fs.readFileSync(`${path.dest}/alias.js`).toString().trim(),
              expected = replaceVersion(fs.readFileSync(`${path.expected}/alias.js`).toString().trim());

        assert(actual);
        assert.deepStrictEqual(actual, expected);
        done();
      }))
      .catch((error) => done(error));
  });

  it('should out to "main.min.js" and "main.min.js.gz" if argument "options.compress" is set.', (done) => {
    const task = buildJs({
      src: `${path.src}/main.js`,
      dest: path.dest,
      compress: true
    });

    task()
      .then((stream) => stream.on('finish', () => {
        const actual = fs.readFileSync(`${path.dest}/main.js`).toString().trim(),
              actualMin = fs.readFileSync(`${path.dest}/main.min.js`).toString().trim(),
              actualGz = fs.readFileSync(`${path.dest}/main.min.js.gz`),
              expected = replaceVersion(fs.readFileSync(`${path.expected}/main.js`).toString().trim());

        assert(actual);
        assert(actualMin);
        assert(actualGz);
        assert.deepStrictEqual(actual, expected);
        done();
      }))
      .catch((error) => done(error));
  });

  it('should out to "main.hoge.js" and "main.hoge.js.gz" if argument "options.compress" is set and argument "options.suffix" is ".hoge".', (done) => {
    const task = buildJs({
      src: `${path.src}/main.js`,
      dest: path.dest,
      suffix: '.hoge',
      compress: true
    });

    task()
      .then((stream) => stream.on('finish', () => {
        const actual = fs.readFileSync(`${path.dest}/main.js`).toString().trim(),
              actualMin = fs.readFileSync(`${path.dest}/main.hoge.js`).toString().trim(),
              actualGz = fs.readFileSync(`${path.dest}/main.hoge.js.gz`),
              expected = replaceVersion(fs.readFileSync(`${path.expected}/main.js`).toString().trim());

        assert(actual);
        assert(actualMin);
        assert(actualGz);
        assert.deepStrictEqual(actual, expected);
        done();
      }))
      .catch((error) => done(error));
  });

  it('should out to "main.js" and "main.js.gz" if argument "options.compress" is set and argument "options.suffix" is empty string.', (done) => {
    const task = buildJs({
      src: `${path.src}/main.js`,
      dest: path.dest,
      suffix: '',
      compress: true
    });

    task()
      .then((stream) => stream.on('finish', () => {
        const actualMin = fs.readFileSync(`${path.dest}/main.js`).toString().trim(),
              actualGz = fs.readFileSync(`${path.dest}/main.js.gz`);

        assert(actualMin);
        assert(actualGz);
        done();
      }))
      .catch((error) => done(error));
  });

  it('should out splitted codes if use dynamic "import" syntax and set optiions.outputOptions.format to "es".', (done) => {
    const entries = [
      'entry.js'
    ];
    const dynamicDeps = [
      'hoge.js',
      'fuga.js'
    ];
    const task = buildJs({
      src: entries.map((file) => `${path.src}/code-splitting/${file}`),
      dest: path.dest,
      browsers: 'chrome >= 80',
      outputOptions: {
        format: 'es',
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js'
      },

      // specify an empty string,
      // if you want to give priority to outputOptions.entryFileNames
      filename: ''
    });

    task()
      .then((stream) => stream.on('finish', () => {
        [...entries, ...dynamicDeps].forEach((file) => {
          const actual = fs.readFileSync(`${path.dest}/${file}`).toString().trim();
          const expected = replaceVersion(fs.readFileSync(`${path.expected}/code-splitting/${file}`).toString().trim());

          assert(actual);
          assert.deepStrictEqual(actual, expected);
        });

        done();
      }))
      .catch((error) => done(error));
  });

});
