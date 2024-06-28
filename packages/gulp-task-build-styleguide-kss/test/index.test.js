import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import buildStyleguide from '../src/index.js';

const DEBUG = Boolean(process.env.DEBUG);
let pkg = {};

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
    .replace(/^\s\s*\n?/gm, '')
    .replace(
      '<span class="version">(v0.0.0)</span>',
      `<span class="version">(v${pkg.version})</span>`
    )
    .replace(
      '<p class="kss-heading-menu__version  kss-c-text">v0.0.0</p>',
      `<p class="kss-heading-menu__version  kss-c-text">v${pkg.version}</p>`
    );
}

describe('gulp-task-build-styleguide-kss', () => {
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
      src: srcDir,
      dest: destDir,
      verbose: DEBUG
    };
  });

  afterEach(async () => {
    await fs.rm(destDir, { recursive: true });
    await fs.mkdir(destDir);
  });

  describe('with default builder', () => {
    it('should output style guide with default options.', async () => {
      const task = buildStyleguide(opts);

      await task();

      await Promise.all(
        ['index.html', 'section-block.html'].map(async (filename) => {
          const actual = await readBuiltFile(path.join(destDir, filename));

          assert.deepEqual(
            actual,
            await readBuiltFile(path.join(expectedDir, 'minimal', filename))
          );
        })
      );
    });

    it('should output style guide includes specified markdown contents with options.homepage', async () => {
      const task = buildStyleguide({
        ...opts,
        homepage: path.join(srcDir, 'hoge.md')
      });

      await task();

      await Promise.all(
        ['index.html', 'section-block.html'].map(async (filename) => {
          const actual = await readBuiltFile(path.join(destDir, filename));

          assert.deepEqual(
            actual,
            await readBuiltFile(path.join(expectedDir, 'homepage', filename))
          );
        })
      );
    });

    it('should output style guide with additional css and js with options.css, options.js and options.mjs.', async () => {
      const task = buildStyleguide({
        ...opts,
        css: ['https://example.com/css/additional.css'],
        js: ['https://example.com/js/additional.js'],
        mjs: ['https://example.com/js/additional-module.js']
      });

      await task();

      await Promise.all(
        ['index.html', 'section-block.html'].map(async (filename) => {
          const actual = await readBuiltFile(path.join(destDir, filename));

          assert.deepEqual(
            actual,
            await readBuiltFile(path.join(expectedDir, 'css-js', filename))
          );
        })
      );
    });
  });

  describe('with legacy builder', () => {
    let builder = null;
    let expectedDirLegacy = null;

    before(() => {
      builder = path.resolve(dirname, '../builder/builder.js');
      expectedDirLegacy = path.resolve(expectedDir, 'regacy');
    });

    it('should be importable.', async () => {
      const { default: builderFromLocalPath } = await import(builder);
      const { default: builderFromPackage } = await import(
        // eslint-disable-next-line import/no-unresolved
        '@hidoo/gulp-task-build-styleguide-kss/legacy-builder'
      );

      assert.equal(builderFromLocalPath, builderFromPackage);
    });

    it('should output style guide to options.dest with default options.', async () => {
      const task = buildStyleguide({ ...opts, builder });

      await task();

      await Promise.all(
        ['index.html', 'section-block.html'].map(async (filename) => {
          const actual = await readBuiltFile(path.join(destDir, filename));

          assert.deepEqual(
            actual,
            await readBuiltFile(
              path.join(expectedDirLegacy, 'minimal', filename)
            )
          );
        })
      );
    });

    it('should output style guide includes specified markdown contents to options.dest with options.homepage', async () => {
      const task = buildStyleguide({
        ...opts,
        builder,
        homepage: path.join(srcDir, 'hoge.md')
      });

      await task();

      await Promise.all(
        ['index.html', 'section-block.html'].map(async (filename) => {
          const actual = await readBuiltFile(path.join(destDir, filename));

          assert.deepEqual(
            actual,
            await readBuiltFile(
              path.join(expectedDirLegacy, 'homepage', filename)
            )
          );
        })
      );
    });

    it('should output style guide injected specified css or js to options.dest with options.css or options.js.', async () => {
      const task = buildStyleguide({
        ...opts,
        builder,
        css: ['https://example.com/css/additional.css'],
        js: ['https://example.com/js/additional.js']
      });

      await task();

      await Promise.all(
        ['index.html', 'section-block.html'].map(async (filename) => {
          const actual = await readBuiltFile(path.join(destDir, filename));

          assert.deepEqual(
            actual,
            await readBuiltFile(
              path.join(expectedDirLegacy, 'css-js', filename)
            )
          );
        })
      );
    });
  });
});
