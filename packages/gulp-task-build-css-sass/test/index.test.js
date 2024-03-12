/* eslint max-statements: off */

import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import gulp from 'gulp';
import buildCss, { autoprefixer, cssmqpacker, csso } from '../src/index.js';

/**
 * read built file
 *
 * @param {String} file filename
 * @return {String}
 */
async function readBuiltFile(file) {
  const content = await fs.readFile(file);

  return content.toString().trim();
}

describe('gulp-task-build-css-sass', () => {
  let dirname = null;
  let fixturesDir = null;
  let srcDir = null;
  let destDir = null;
  let expectedDir = null;
  let opts = null;

  before(() => {
    dirname = path.dirname(fileURLToPath(import.meta.url));
    fixturesDir = path.resolve(dirname, 'fixtures');
    srcDir = path.resolve(fixturesDir, 'src');
    destDir = path.resolve(fixturesDir, 'dest');
    expectedDir = path.resolve(fixturesDir, 'expected');

    opts = {
      dest: destDir,
      verbose: Boolean(process.env.DEBUG)
    };
  });

  afterEach(async () => {
    await fs.rm(destDir, { recursive: true });
    await fs.mkdir(destDir);
  });

  it('should out css file with default options.', async () => {
    const task = buildCss({
      ...opts,
      src: `${srcDir}/style.scss`,
      compress: false
    });

    await new Promise((resolve) => task().on('finish', resolve));

    const actual = await readBuiltFile(`${destDir}/main.css`);
    const expected = await readBuiltFile(`${expectedDir}/main.css`);

    assert(actual);
    assert.equal(actual, expected);
  });

  it('should out specified named css file by options.filename.', async () => {
    const task = buildCss({
      ...opts,
      src: `${srcDir}/style.scss`,
      filename: 'hoge.css',
      compress: false
    });

    await new Promise((resolve) => task().on('finish', resolve));

    const actual = await readBuiltFile(`${destDir}/hoge.css`);
    const expected = await readBuiltFile(`${expectedDir}/main.css`);

    assert(actual);
    assert.equal(actual, expected);
  });

  it('should out css file applied vendor-prefix by autoprefixer and options.browsers.', async () => {
    const task = buildCss({
      ...opts,
      src: `${srcDir}/style.scss`,
      browsers: ['android >= 2.3'],
      compress: false
    });

    await new Promise((resolve) => task().on('finish', resolve));

    const actual = await readBuiltFile(`${destDir}/main.css`);
    const expected = await readBuiltFile(`${expectedDir}/main.browsers.css`);

    assert(actual);
    assert.equal(actual, expected);
  });

  it('should out css file applied vendor-prefix by autoprefixer and options.targets.', async () => {
    const task = buildCss({
      ...opts,
      src: `${srcDir}/style.scss`,
      targets: ['android >= 2.3'],
      compress: false
    });

    await new Promise((resolve) => task().on('finish', resolve));

    const actual = await readBuiltFile(`${destDir}/main.css`);
    const expected = await readBuiltFile(`${expectedDir}/main.browsers.css`);

    assert(actual);
    assert.equal(actual, expected);
  });

  it('should out css file applied vendor-prefix by autoprefixer with .browserslistrc.', async () => {
    const task = buildCss({
      ...opts,
      src: `${srcDir}/style.scss`,
      compress: false
    });

    process.env.BROWSERSLIST_CONFIG = path.resolve(
      expectedDir,
      '.browserslistrc'
    );
    await new Promise((resolve) => task().on('finish', resolve));
    process.env.BROWSERSLIST_CONFIG = '';

    const actual = await readBuiltFile(`${destDir}/main.css`);
    const expected = await readBuiltFile(`${expectedDir}/main.browsers.css`);

    assert(actual);
    assert.equal(actual, expected);
  });

  it('should out css file with sourcemap file with options.sassOptions.sourceMap.', async () => {
    const task = buildCss({
      ...opts,
      src: `${srcDir}/style.scss`,
      sassOptions: {
        sourceMap: '.'
      },
      compress: false
    });

    await new Promise((resolve) => task().on('finish', resolve));

    const actual = await readBuiltFile(`${destDir}/main.css`);
    const expected = await readBuiltFile(`${expectedDir}/main.sourcemap.css`);

    assert(actual);
    assert(await readBuiltFile(`${destDir}/main.css.map`));
    assert.equal(actual, expected);
  });

  it('should out minified and compressed css file by options.compress.', async () => {
    const task = buildCss({
      ...opts,
      src: `${srcDir}/style.scss`,
      compress: true
    });

    await new Promise((resolve) => task().on('finish', resolve));

    await Promise.all(
      ['css', 'min.css', 'min.css.gz'].map(async (ext) => {
        if (ext === '.css') {
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

  it('should out named minified and named compressed css file by options.compress and options.suffix.', async () => {
    const task = buildCss({
      ...opts,
      src: `${srcDir}/style.scss`,
      suffix: '.compressed',
      compress: true
    });

    await new Promise((resolve) => task().on('finish', resolve));

    await Promise.all(
      ['css', 'compressed.css', 'compressed.css.gz'].map(async (ext) => {
        if (ext === '.css') {
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

  it('should out minified and compressed css file with no suffix by options.compress and empty options.suffix.', async () => {
    const task = buildCss({
      ...opts,
      src: `${srcDir}/style.scss`,
      suffix: '',
      compress: true
    });

    await new Promise((resolve) => task().on('finish', resolve));

    await Promise.all(
      ['css', 'css.gz'].map(async (ext) => {
        const actual = await fs.readFile(`${destDir}/main.${ext}`);

        assert(actual);
      })
    );
  });

  it('should out css file injected banner with options.banner.', async () => {
    const task = buildCss({
      ...opts,
      src: `${srcDir}/style.scss`,
      banner: '/*! copyright <%= pkg.author %> */\n',
      compress: false
    });

    await new Promise((resolve) => task().on('finish', resolve));

    const actual = await readBuiltFile(`${destDir}/main.css`);
    const expected = await readBuiltFile(`${expectedDir}/main.banner.css`);

    assert(actual);
    assert.equal(actual, expected);
  });

  context('with options.postcssPlugins', () => {
    it('should out css file removed unused styles by postcss-uncss.', async () => {
      const uncss = (await import('postcss-uncss')).default;
      const task = buildCss({
        ...opts,
        src: `${srcDir}/style.scss`,
        postcssPlugins(plugin, { current, last }) {
          if (current === last) {
            return [
              plugin,
              {
                name: 'uncss',
                factory: uncss,
                config: {
                  html: [`${srcDir}/target.html`]
                }
              }
            ];
          }
          return plugin;
        },
        compress: false
      });

      await new Promise((resolve) => task().on('finish', resolve));

      const actual = await readBuiltFile(`${destDir}/main.css`);
      const expected = await readBuiltFile(
        `${expectedDir}/main.remove-unused.css`
      );

      assert(actual);
      assert.equal(actual, expected);
    });

    it('should out css file embed url() value by postcss-url.', async () => {
      const url = (await import('postcss-url')).default;
      const task = buildCss({
        ...opts,
        src: `${srcDir}/style.url.scss`,
        postcssPlugins(plugin, { current, last }) {
          if (current === last) {
            return [
              plugin,
              {
                name: 'url',
                factory: url,
                config: {
                  url: 'inline',
                  basePath: srcDir
                }
              }
            ];
          }
          return plugin;
        },
        compress: false
      });

      await new Promise((resolve) => task().on('finish', resolve));

      const actual = await readBuiltFile(`${destDir}/main.css`);
      const expected = await readBuiltFile(`${expectedDir}/main.url.css`);

      assert(actual);
      assert.equal(actual, expected);
    });

    it('should out css file applied custom process.', async () => {
      const customProcess = () => (root) => {
        root.walkRules(/\.block/, (rule) => {
          rule.selectors = rule.selectors.map((selector) =>
            selector.trim().replace(/\.block/, '.hoge')
          );
        });

        return root;
      };
      const task = buildCss({
        ...opts,
        src: `${srcDir}/style.scss`,
        postcssPlugins(plugin, { current, last }) {
          if (current === last) {
            return [
              plugin,
              {
                name: 'custom-process',
                factory: customProcess
              }
            ];
          }
          return plugin;
        },
        compress: false
      });

      await new Promise((resolve) => task().on('finish', resolve));

      const actual = await readBuiltFile(`${destDir}/main.css`);
      const expected = await readBuiltFile(
        `${expectedDir}/main.post-process.css`
      );

      assert(actual);
      assert.equal(actual, expected);
    });
  });

  it('should not stop process if throw error.', async () => {
    const task = buildCss({
      ...opts,
      src: `${srcDir}/error.scss`,
      compress: false
    });

    await new Promise((resolve) => task().on('finish', resolve));
  });

  it('should call next task after files were outputted in gulp.series.', async () => {
    const task = buildCss({
      ...opts,
      src: `${srcDir}/style.scss`,
      compress: false
    });

    await new Promise((resolve) => {
      gulp.series(task, async () => {
        const actual = await readBuiltFile(`${destDir}/main.css`);
        const expected = await readBuiltFile(`${expectedDir}/main.css`);

        assert(actual);
        assert.deepEqual(actual, expected);
        resolve();
      })();
    });
  });

  describe('exports postcss plugins', () => {
    it('should be accessible to postcss plugins', async () => {
      assert.equal((await import('autoprefixer')).default, autoprefixer);
      assert.equal((await import('css-mqpacker')).default, cssmqpacker);
      assert.equal((await import('postcss-csso')).default, csso);
    });
  });
});
