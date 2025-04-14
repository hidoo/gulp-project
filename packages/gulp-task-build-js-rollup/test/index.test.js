/* eslint max-len: off, no-magic-numbers: off, max-statements: off */

import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import gulp from 'gulp';
import buildJs from '../src/index.js';

const DEBUG = Boolean(process.env.DEBUG);
let pkg = null;

/**
 * read built file
 *
 * @param {String} file filename
 * @return {String}
 */
async function readBuiltFile(file) {
  const content = await fs.readFile(file);

  return content
    .toString()
    .trim()
    .replace(/<core-js version>/g, pkg.devDependencies['core-js'])
    .replace(/<pkg version>/g, pkg.version);
}

describe('gulp-task-build-js-rollup', () => {
  let dirname = null;
  let fixturesDir = null;
  let srcDir = null;
  let destDir = null;
  let expectedDir = null;
  let opts = null;

  before(async () => {
    pkg = JSON.parse(
      await fs.readFile(path.resolve(process.cwd(), 'package.json'))
    );
    dirname = path.dirname(fileURLToPath(import.meta.url));
    fixturesDir = path.resolve(dirname, 'fixtures');
    srcDir = path.resolve(fixturesDir, 'src');
    destDir = path.resolve(fixturesDir, 'dest');
    expectedDir = path.resolve(fixturesDir, 'expected');

    opts = {
      dest: destDir,
      inputOptions: {
        plugins({ name, factory, config }) {
          // disable banner settings
          if (name === 'license') {
            config.banner = null;
          }
          return { name, factory, config: { ...config } };
        }
      },
      verbose: DEBUG
    };
  });

  after(() => {
    pkg = null;
    dirname = null;
    fixturesDir = null;
    srcDir = null;
    destDir = null;
    expectedDir = null;
  });

  afterEach(async () => {
    // await fs.rm(destDir, { recursive: true });
    // await fs.mkdir(destDir);
  });

  it('should out js file with default options.', async () => {
    const task = buildJs({
      ...opts,
      src: `${srcDir}/main.js`
    });

    await new Promise((resolve) => task().on('finish', resolve));

    const actual = await readBuiltFile(`${destDir}/main.js`);
    const expected = await readBuiltFile(`${expectedDir}/main.js`);

    assert(actual);
    assert.equal(actual, expected);
  });

  it('should out specified named js file by options.filename.', async () => {
    const task = buildJs({
      ...opts,
      src: `${srcDir}/main.js`,
      filename: 'main.hoge.js'
    });

    await new Promise((resolve) => task().on('finish', resolve));

    const actual = await readBuiltFile(`${destDir}/main.hoge.js`);
    const expected = await readBuiltFile(`${expectedDir}/main.js`);

    assert(actual);
    assert.equal(actual, expected);
  });

  it('should out polyfilled js file by "@babel/preset-env" and options.browsers.', async () => {
    const task = buildJs({
      ...opts,
      src: `${srcDir}/main.js`,
      filename: 'main.browsers.js',
      browsers: 'ie >= 8'
    });

    await new Promise((resolve) => task().on('finish', resolve));

    const actual = await readBuiltFile(`${destDir}/main.browsers.js`);
    const expected = await readBuiltFile(`${expectedDir}/main.browsers.js`);

    assert(actual);
    assert.equal(actual, expected);
  });

  it('should out polyfilled js file by "@babel/preset-env" and options.targets.', async () => {
    const task = buildJs({
      ...opts,
      src: `${srcDir}/main.js`,
      filename: 'main.targets.js',
      targets: 'ie >= 8'
    });

    await new Promise((resolve) => task().on('finish', resolve));

    const actual = await readBuiltFile(`${destDir}/main.targets.js`);
    const expected = await readBuiltFile(`${expectedDir}/main.browsers.js`);

    assert(actual);
    assert.equal(actual, expected);
  });

  it('should out js file with transformed jsx components by "@babel/preset-react".', async () => {
    const task = buildJs({
      ...opts,
      src: `${srcDir}/with-jsx.js`,
      filename: 'with-jsx.js',
      inputOptions: {
        plugins({ name, factory, config }) {
          if (name === 'commonjs') {
            config.exclude = [`${srcDir}/with-jsx.js`];
          }
          if (name === 'license') {
            config.banner = null;
          }
          return { name, factory, config: { ...config } };
        }
      }
    });

    await new Promise((resolve) => task().on('finish', resolve));

    const actual = await readBuiltFile(`${destDir}/with-jsx.js`);
    const expected = await readBuiltFile(`${expectedDir}/with-jsx.js`);

    assert(actual);
    assert.equal(actual, expected);
  });

  it('should out js file with injected JSON by @rollup/plugin-json".', async () => {
    const task = buildJs({
      ...opts,
      src: `${srcDir}/with-json.js`,
      filename: 'with-json.js'
    });

    await new Promise((resolve) => task().on('finish', resolve));

    const actual = await readBuiltFile(`${destDir}/with-json.js`);
    const expected = await readBuiltFile(`${expectedDir}/with-json.js`);

    assert(actual);
    assert.equal(actual, expected);
  });

  it('should out js file with resolved modules by @rollup/plugin-alias.', async () => {
    const task = buildJs({
      ...opts,
      src: `${srcDir}/with-alias.js`,
      filename: 'with-alias.js',
      inputOptions: {
        plugins({ name, factory, config }) {
          if (name === 'alias') {
            config.entries = [
              {
                find: '~',
                replacement: srcDir
              }
            ];
          }
          if (name === 'license') {
            config.banner = null;
          }
          return { name, factory, config: { ...config } };
        }
      }
    });

    await new Promise((resolve) => task().on('finish', resolve));

    const actual = await readBuiltFile(`${destDir}/with-alias.js`);
    const expected = await readBuiltFile(`${expectedDir}/with-alias.js`);

    assert(actual);
    assert.equal(actual, expected);
  });

  it('should out minified and compressed js files by options.compress.', async () => {
    const task = buildJs({
      ...opts,
      src: `${srcDir}/main.js`,
      compress: true
    });

    await new Promise((resolve) => task().on('finish', resolve));

    await Promise.all(
      ['js', 'min.js', 'min.js.gz'].map(async (ext) => {
        if (ext === '.js') {
          const actual = await readBuiltFile(`${destDir}/main.js`);
          const expected = await readBuiltFile(`${expectedDir}/main.js`);

          assert(actual);
          assert.equal(actual, expected);
        } else {
          const actual = await fs.readFile(`${destDir}/main.${ext}`);

          assert(actual);
        }
      })
    );
  });

  it('should out named minified and named compressed js files by options.compress and options.suffix.', async () => {
    const task = buildJs({
      ...opts,
      src: `${srcDir}/main.js`,
      suffix: '.compressed',
      compress: true
    });

    await new Promise((resolve) => task().on('finish', resolve));

    await Promise.all(
      ['js', 'compressed.js', 'compressed.js.gz'].map(async (ext) => {
        if (ext === '.js') {
          const actual = await readBuiltFile(`${destDir}/main.js`);
          const expected = await readBuiltFile(`${expectedDir}/main.js`);

          assert(actual);
          assert.equal(actual, expected);
        } else {
          const actual = await fs.readFile(`${destDir}/main.${ext}`);

          assert(actual);
        }
      })
    );
  });

  it('should out minified and compressed js files with no suffix by options.compress and empty options.suffix.', async () => {
    const task = buildJs({
      ...opts,
      src: `${srcDir}/main.js`,
      suffix: '',
      compress: true
    });

    await new Promise((resolve) => task().on('finish', resolve));

    await Promise.all(
      ['js', 'js.gz'].map(async (ext) => {
        const actual = await fs.readFile(`${destDir}/main.${ext}`);

        assert(actual);
      })
    );
  });

  it('should out code splitted js files with dynamic "import" syntax and "es" output format.', async () => {
    const entries = ['entry.js'];
    const dependencies = ['hoge.js', 'fuga.js'];
    const task = buildJs({
      ...opts,
      src: entries.map((file) => `${srcDir}/code-splitting/${file}`),
      dest: `${destDir}/code-splitting/`,
      targets: 'chrome >= 80',
      outputOptions: {
        format: 'es',
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js'
      },

      // specify an empty string,
      // if you want to give priority to outputOptions.entryFileNames
      filename: ''
    });

    await new Promise((resolve) => task().on('finish', resolve));

    await Promise.all(
      [...entries, ...dependencies].map(async (file) => {
        const actual = await readBuiltFile(`${destDir}/code-splitting/${file}`);
        const expected = await readBuiltFile(
          `${expectedDir}/code-splitting/${file}`
        );

        assert(actual);
        assert.deepEqual(actual, expected);
      })
    );
  });

  it('should out multiple format js files with array type outputOptions.', async () => {
    const task = buildJs({
      ...opts,
      src: `${srcDir}/main.js`,
      dest: `${destDir}/multiple-formats/`,
      targets: 'chrome >= 80',
      outputOptions: [
        {
          format: 'es',
          file: 'main.es.js'
        },
        {
          format: 'cjs',
          file: 'main.cjs.js'
        }
      ],

      // specify an empty string,
      // if you want to give priority to outputOptions.file
      filename: ''
    });

    await new Promise((resolve) => task().on('finish', resolve));

    await Promise.all(
      ['es', 'cjs'].map(async (format) => {
        const actual = await readBuiltFile(
          `${destDir}/multiple-formats/main.${format}.js`
        );
        const expected = await readBuiltFile(
          `${expectedDir}/multiple-formats/main.${format}.js`
        );

        assert(actual);
        assert.deepEqual(actual, expected);
      })
    );
  });

  it('should not stop process when throw error.', async () => {
    const task = buildJs({
      ...opts,
      src: `${srcDir}/error.js`,
      compress: false
    });

    await new Promise((resolve) => task().on('finish', resolve));
  });

  it('should call next task after files were outputted in gulp.series.', async () => {
    const task = buildJs({
      ...opts,
      src: `${srcDir}/main.js`
    });

    await new Promise((resolve) => {
      gulp.series(task, async () => {
        const actual = await readBuiltFile(`${destDir}/main.js`);
        const expected = await readBuiltFile(`${expectedDir}/main.js`);

        assert(actual);
        assert.deepEqual(actual, expected);
        resolve();
      })();
    });
  });
});
