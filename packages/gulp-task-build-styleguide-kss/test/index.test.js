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
    .replace(
      '<span class="version">(v0.0.0)</span>',
      `<span class="version">(v${pkg.version})</span>`
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

  it('should output style guide to options.dest with default options.', async () => {
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

  it('should output style guide includes specified markdown contents to options.dest with options.homepage', async () => {
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

  it('should output style guide injected specified css or js to options.dest with options.css or options.js.', async () => {
    const task = buildStyleguide({
      ...opts,
      css: [
        '//cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css'
      ],
      js: [
        '//cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.10/lodash.core.min.js'
      ]
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
