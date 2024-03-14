/* eslint max-statements: off */

import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import util from 'node:util';
import zlib from 'node:zlib';
import PluginError from 'plugin-error';
import Vinyl from 'vinyl';
import compress, { compressors } from '../src/index.js';

const DEBUG = process.env.DEBUG;

/**
 * mapping for decompressor
 *
 * @type {Object}
 */
const decompressors = {
  '.gz': util.promisify(zlib.gunzip),
  '.br': util.promisify(zlib.brotliDecompress)
};

/**
 * returns file has an extname of compressed file whether or not.
 *
 * @param {Vinyl} file file
 * @return {Boolean}
 */
function hasCompressedFileExtname(file) {
  return decompressors[file.extname];
}

/**
 * decompress archive file
 *
 * @param {Vinyl} file compressed file
 * @return {Buffer}
 */
async function decompress(file) {
  const compressor = decompressors[file.extname];

  if (typeof compressor !== 'function') {
    throw new Error(`Unsupported file "${file.basename}" specified.`);
  }
  return await compressor(file.contents);
}

describe('gulp-plugin-compress', () => {
  let dirname = null;
  let srcDir = null;
  let destDir = null;
  let sources = null;
  let files = null;
  let opts = null;

  before(() => {
    dirname = path.dirname(fileURLToPath(import.meta.url));
    srcDir = path.resolve(dirname, 'fixtures', 'src');
    destDir = path.resolve(dirname, 'fixtures', 'dest');
    sources = [
      path.resolve(srcDir, 'example-html.html'),
      path.resolve(srcDir, 'example-txt.txt')
    ];
    opts = {
      verbose: DEBUG
    };
  });

  beforeEach(async () => {
    files = await Promise.all(
      sources.map(
        async (src) =>
          new Vinyl({
            path: src,
            contents: await fs.readFile(src)
          })
      )
    );
  });

  afterEach(() => {
    files = null;
  });

  context('by default.', () => {
    it('should out compressed files with original files.', async () => {
      const plugin = compress(opts);
      const promise = new Promise((resolve, reject) => {
        plugin.on('end', resolve);
        plugin.on('error', reject);
      });
      const originals = {};
      const outputs = [];

      plugin.on('data', (file) => outputs.push(file));
      files.forEach((file) => {
        plugin.write(file);
        originals[file.basename] = file.contents;
      });
      plugin.end();

      await promise;

      assert.deepEqual(
        outputs.map(({ basename }) => basename),
        [
          'example-html.html',
          'example-html.html.gz',
          'example-html.html.br',
          'example-txt.txt',
          'example-txt.txt.gz',
          'example-txt.txt.br'
        ],
        'Output files.'
      );

      await Promise.all(
        outputs.map(async (file) => {
          if (hasCompressedFileExtname(file)) {
            assert.deepEqual(
              await decompress(file),
              originals[file.stem],
              `File ${file.stem} is losslessly compressed.`
            );
          }

          if (DEBUG) {
            await fs.writeFile(
              path.resolve(destDir, file.basename),
              file.contents
            );
          }
        })
      );
    });
  });

  context('options.gzip is falsy.', () => {
    it('should out compressed files without gzip files.', async () => {
      const plugin = compress({ ...opts, gzip: false });
      const promise = new Promise((resolve, reject) => {
        plugin.on('end', resolve);
        plugin.on('error', reject);
      });
      const originals = {};
      const outputs = [];

      plugin.on('data', (file) => outputs.push(file));
      files.forEach((file) => {
        plugin.write(file);
        originals[file.basename] = file.contents;
      });
      plugin.end();

      await promise;

      assert.deepEqual(
        outputs.map(({ basename }) => basename),
        [
          'example-html.html',
          'example-html.html.br',
          'example-txt.txt',
          'example-txt.txt.br'
        ],
        'Output files without gzip files.'
      );

      await Promise.all(
        outputs.map(async (file) => {
          if (hasCompressedFileExtname(file)) {
            assert.deepEqual(
              await decompress(file),
              originals[file.stem],
              `File ${file.stem} is losslessly compressed.`
            );
          }

          if (DEBUG) {
            await fs.writeFile(
              path.resolve(destDir, file.basename),
              file.contents
            );
          }
        })
      );
    });
  });

  context('options.brotli is falsy.', () => {
    it('should out compressed files without brotli files.', async () => {
      const plugin = compress({ ...opts, brotli: false });
      const promise = new Promise((resolve, reject) => {
        plugin.on('end', resolve);
        plugin.on('error', reject);
      });
      const originals = {};
      const outputs = [];

      plugin.on('data', (file) => outputs.push(file));
      files.forEach((file) => {
        plugin.write(file);
        originals[file.basename] = file.contents;
      });
      plugin.end();

      await promise;

      assert.deepEqual(
        outputs.map(({ basename }) => basename),
        [
          'example-html.html',
          'example-html.html.gz',
          'example-txt.txt',
          'example-txt.txt.gz'
        ],
        'Output files without brotli files.'
      );

      await Promise.all(
        outputs.map(async (file) => {
          if (hasCompressedFileExtname(file)) {
            assert.deepEqual(
              await decompress(file),
              originals[file.stem],
              `File ${file.stem} is losslessly compressed.`
            );
          }

          if (DEBUG) {
            await fs.writeFile(
              path.resolve(destDir, file.basename),
              file.contents
            );
          }
        })
      );
    });
  });

  context('options.append is falsy.', () => {
    it('should out compressed files without original files.', async () => {
      const plugin = compress({ ...opts, append: false });
      const promise = new Promise((resolve, reject) => {
        plugin.on('end', resolve);
        plugin.on('error', reject);
      });
      const originals = {};
      const outputs = [];

      plugin.on('data', (file) => outputs.push(file));
      files.forEach((file) => {
        plugin.write(file);
        originals[file.basename] = file.contents;
      });
      plugin.end();

      await promise;

      assert.deepEqual(
        outputs.map(({ basename }) => basename),
        [
          'example-html.html.gz',
          'example-html.html.br',
          'example-txt.txt.gz',
          'example-txt.txt.br'
        ],
        'Output files without original files.'
      );

      await Promise.all(
        outputs.map(async (file) => {
          if (hasCompressedFileExtname(file)) {
            assert.deepEqual(
              await decompress(file),
              originals[file.stem],
              `File ${file.stem} is losslessly compressed.`
            );
          }

          if (DEBUG) {
            await fs.writeFile(
              path.resolve(destDir, file.basename),
              file.contents
            );
          }
        })
      );
    });
  });

  context('options.keepExtname is falsy.', () => {
    it('should out compressed files without original extname.', async () => {
      const plugin = compress({ ...opts, keepExtname: false });
      const promise = new Promise((resolve, reject) => {
        plugin.on('end', resolve);
        plugin.on('error', reject);
      });
      const originals = {};
      const outputs = [];

      plugin.on('data', (file) => outputs.push(file));
      files.forEach((file) => {
        plugin.write(file);
        originals[file.basename] = file.contents;
      });
      plugin.end();

      await promise;

      assert.deepEqual(
        outputs.map(({ basename }) => basename),
        [
          'example-html.html',
          'example-html.gz',
          'example-html.br',
          'example-txt.txt',
          'example-txt.gz',
          'example-txt.br'
        ],
        'Output files without original extname in compressed files.'
      );

      await Promise.all(
        outputs.map(async (file) => {
          if (hasCompressedFileExtname(file)) {
            assert.deepEqual(
              await decompress(file),
              originals[`${file.stem}.${file.stem.split('-')[1]}`],
              `File ${file.stem} is losslessly compressed.`
            );
          }

          if (DEBUG) {
            await fs.writeFile(
              path.resolve(destDir, file.basename),
              file.contents
            );
          }
        })
      );
    });
  });

  context('if failed.', () => {
    it('should emit "error" with PluginError.', async () => {
      const plugin = compress(opts);
      const promise = new Promise((resolve) => {
        plugin.on('end', resolve);
        plugin.on('error', resolve);
      });
      const fd = await fs.open(sources[0]);

      plugin.write(
        new Vinyl({
          path: sources[0],
          contents: fd.createReadStream()
        })
      );

      fd.close();
      plugin.end();

      assert((await promise) instanceof PluginError);
    });
  });

  describe('compressors', () => {
    it('should be accessible to compressors as named export.', async () => {
      assert.deepEqual(
        (await import('../src/index.js')).compressors,
        compressors
      );
    });
  });
});
