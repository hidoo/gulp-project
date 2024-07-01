import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { concatJs, concatCss } from '../src/index.js';

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
    .replace(/^\s\s*\n?/gm, '');
}

describe('gulp-task-concat', () => {
  let dirname = null;
  let fixturesDir = null;
  let srcDir = null;
  let destDir = null;
  let expectedDir = null;

  before(() => {
    dirname = path.dirname(fileURLToPath(import.meta.url));
    fixturesDir = path.resolve(dirname, 'fixtures');
    srcDir = path.resolve(fixturesDir, 'src');
    destDir = path.resolve(fixturesDir, 'dest');
    expectedDir = path.resolve(fixturesDir, 'expected');
  });

  afterEach(async () => {
    await fs.rm(destDir, { recursive: true });
    await fs.mkdir(destDir);
  });

  describe('concatJs', () => {
    let options = null;

    beforeEach(() => {
      options = {
        src: [
          path.join(srcDir, 'a.js'),
          path.join(srcDir, 'c.js'),
          path.join(srcDir, 'b.js')
        ],
        dest: destDir
      };
    });

    afterEach(() => {
      options = null;
    });

    it('should out to "bundle.js" with default options.', async () => {
      const task = concatJs(options);

      await new Promise((resolve) => task().on('finish', resolve));

      const actual = await readBuiltFile(path.join(destDir, 'bundle.js'));
      const expected = await readBuiltFile(
        path.join(expectedDir, 'bundle.default.js')
      );

      assert(actual);
      assert.deepEqual(actual, expected);
    });

    it('should out file as specified filename with options.filename.', async () => {
      const task = concatJs({
        ...options,
        filename: 'hoge.js'
      });

      await new Promise((resolve) => task().on('finish', resolve));

      const actual = await readBuiltFile(path.join(destDir, 'hoge.js'));
      const expected = await readBuiltFile(
        path.join(expectedDir, 'bundle.filename.js')
      );

      assert(actual);
      assert.deepEqual(actual, expected);
    });

    it('should out file includes specified banner with options.banner.', async () => {
      const task = concatJs({
        ...options,
        banner: '/* copyright <%= pkg.author %> */\n'
      });

      await new Promise((resolve) => task().on('finish', resolve));

      const actual = await readBuiltFile(path.join(destDir, 'bundle.js'));
      const expected = await readBuiltFile(
        path.join(expectedDir, 'bundle.banner.js')
      );

      assert(actual);
      assert.deepEqual(actual, expected);
    });

    it('should out compressed file with options.compress.', async () => {
      const task = concatJs({
        ...options,
        compress: true
      });

      await new Promise((resolve) => task().on('finish', resolve));

      {
        const actual = await readBuiltFile(path.join(destDir, 'bundle.js'));
        const expected = await readBuiltFile(
          path.join(expectedDir, 'bundle.compress.js')
        );

        assert(actual);
        assert.deepEqual(actual, expected);
      }

      {
        const actual = await readBuiltFile(path.join(destDir, 'bundle.min.js'));
        const expected = await readBuiltFile(
          path.join(expectedDir, 'bundle.compress.min.js')
        );

        assert(actual);
        assert(await readBuiltFile(path.join(destDir, 'bundle.min.js.gz')));
        assert(await readBuiltFile(path.join(destDir, 'bundle.min.js.br')));
        assert.deepEqual(actual, expected);
      }
    });

    it('should out compressed file with options.compress and options.suffix.', async () => {
      const task = concatJs({
        ...options,
        suffix: '.hoge',
        compress: true
      });

      await new Promise((resolve) => task().on('finish', resolve));

      {
        const actual = await readBuiltFile(path.join(destDir, 'bundle.js'));
        const expected = await readBuiltFile(
          path.join(expectedDir, 'bundle.compress.js')
        );

        assert(actual);
        assert.deepEqual(actual, expected);
      }

      {
        const actual = await readBuiltFile(
          path.join(destDir, 'bundle.hoge.js')
        );
        const expected = await readBuiltFile(
          path.join(expectedDir, 'bundle.compress.min.js')
        );

        assert(actual);
        assert(await readBuiltFile(path.join(destDir, 'bundle.hoge.js.gz')));
        assert(await readBuiltFile(path.join(destDir, 'bundle.hoge.js.br')));
        assert.deepEqual(actual, expected);
      }
    });

    it('should out compressed file with options.compress and without options.suffix.', async () => {
      const task = concatJs({
        ...options,
        suffix: '',
        compress: true
      });
      let err = null;

      await new Promise((resolve) => task().on('finish', resolve));

      try {
        await readBuiltFile(path.join(destDir, 'bundle.min.js'));
      } catch (error) {
        err = error;
      }

      assert(err instanceof Error);

      const actual = await readBuiltFile(path.join(destDir, 'bundle.js'));
      const expected = await readBuiltFile(
        path.join(expectedDir, 'bundle.compress.min.js')
      );

      assert(actual);
      assert(await readBuiltFile(path.join(destDir, 'bundle.js.gz')));
      assert(await readBuiltFile(path.join(destDir, 'bundle.js.br')));
      assert.deepEqual(actual, expected);
    });
  });

  describe('concatCss', () => {
    let options = null;

    beforeEach(() => {
      options = {
        src: [
          path.join(srcDir, 'a.css'),
          path.join(srcDir, 'c.css'),
          path.join(srcDir, 'b.css')
        ],
        dest: destDir
      };
    });

    afterEach(() => {
      options = null;
    });

    it('should out to "bundle.css" with default options.', async () => {
      const task = concatCss(options);

      await new Promise((resolve) => task().on('finish', resolve));

      const actual = await readBuiltFile(path.join(destDir, 'bundle.css'));
      const expected = await readBuiltFile(
        path.join(expectedDir, 'bundle.default.css')
      );

      assert(actual);
      assert.deepEqual(actual, expected);
    });

    it('should out file as specified filename with options.filename.', async () => {
      const task = concatCss({
        ...options,
        filename: 'hoge.css'
      });

      await new Promise((resolve) => task().on('finish', resolve));

      const actual = await readBuiltFile(path.join(destDir, 'hoge.css'));
      const expected = await readBuiltFile(
        path.join(expectedDir, 'bundle.filename.css')
      );

      assert(actual);
      assert.deepEqual(actual, expected);
    });

    it('should out file includes specified banner with options.banner.', async () => {
      const task = concatCss({
        ...options,
        banner: '/* copyright <%= pkg.author %> */\n'
      });

      await new Promise((resolve) => task().on('finish', resolve));

      const actual = await readBuiltFile(path.join(destDir, 'bundle.css'));
      const expected = await readBuiltFile(
        path.join(expectedDir, 'bundle.banner.css')
      );

      assert(actual);
      assert.deepEqual(actual, expected);
    });

    it('should out compressed file with options.compress.', async () => {
      const task = concatCss({
        ...options,
        compress: true
      });

      await new Promise((resolve) => task().on('finish', resolve));

      {
        const actual = await readBuiltFile(path.join(destDir, 'bundle.css'));
        const expected = await readBuiltFile(
          path.join(expectedDir, 'bundle.compress.css')
        );

        assert(actual);
        assert.deepEqual(actual, expected);
      }

      {
        const actual = await readBuiltFile(
          path.join(destDir, 'bundle.min.css')
        );
        const expected = await readBuiltFile(
          path.join(expectedDir, 'bundle.compress.min.css')
        );

        assert(actual);
        assert(await readBuiltFile(path.join(destDir, 'bundle.min.css.gz')));
        assert(await readBuiltFile(path.join(destDir, 'bundle.min.css.br')));
        assert.deepEqual(actual, expected);
      }
    });

    it('should out compressed file with options.compress and options.suffix.', async () => {
      const task = concatCss({
        ...options,
        suffix: '.hoge',
        compress: true
      });

      await new Promise((resolve) => task().on('finish', resolve));

      {
        const actual = await readBuiltFile(path.join(destDir, 'bundle.css'));
        const expected = await readBuiltFile(
          path.join(expectedDir, 'bundle.compress.css')
        );

        assert(actual);
        assert.deepEqual(actual, expected);
      }

      {
        const actual = await readBuiltFile(
          path.join(destDir, 'bundle.hoge.css')
        );
        const expected = await readBuiltFile(
          path.join(expectedDir, 'bundle.compress.min.css')
        );

        assert(actual);
        assert(await readBuiltFile(path.join(destDir, 'bundle.hoge.css.gz')));
        assert(await readBuiltFile(path.join(destDir, 'bundle.hoge.css.br')));
        assert.deepEqual(actual, expected);
      }
    });

    it('should out compressed file with options.compress and without options.suffix.', async () => {
      const task = concatCss({
        ...options,
        suffix: '',
        compress: true
      });
      let err = null;

      await new Promise((resolve) => task().on('finish', resolve));

      try {
        await readBuiltFile(path.join(destDir, 'bundle.min.css'));
      } catch (error) {
        err = error;
      }

      assert(err instanceof Error);

      const actual = await readBuiltFile(path.join(destDir, 'bundle.css'));
      const expected = await readBuiltFile(
        path.join(expectedDir, 'bundle.compress.min.css')
      );

      assert(actual);
      assert(await readBuiltFile(path.join(destDir, 'bundle.css.gz')));
      assert(await readBuiltFile(path.join(destDir, 'bundle.css.br')));
      assert.deepEqual(actual, expected);
    });
  });
});
