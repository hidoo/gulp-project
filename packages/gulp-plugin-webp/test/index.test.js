import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Vinyl from 'vinyl';
import PluginError from 'plugin-error';
import webp from '../src/index.js';

const DEBUG = false;

describe('gulp-plugin-webp', () => {
  let dirname = null;
  let fixturesDir = null;
  let srcDir = null;
  let destDir = null;
  let expectedDir = null;
  let cases = null;

  before(() => {
    dirname = path.dirname(fileURLToPath(import.meta.url));
    fixturesDir = path.resolve(dirname, 'fixtures');
    srcDir = path.resolve(fixturesDir, 'src');
    destDir = path.resolve(fixturesDir, 'dest');
    expectedDir = path.resolve(fixturesDir, 'expected');
  });

  beforeEach(() => {
    cases = [
      [
        path.resolve(srcDir, 'sample.jpg'),
        path.resolve(expectedDir, 'sample.jpg.webp')
      ],
      [
        path.resolve(srcDir, 'sample.png'),
        path.resolve(expectedDir, 'sample.png.webp')
      ]
    ];
  });

  after(() => {
    cases = null;
  });

  it('should out original image and webp as "<original filename>.webp".', async () => {
    await Promise.all(
      cases.map(async ([src, expected]) => {
        const extname = path.extname(src);
        const basename = path.basename(src, extname);
        const srcBuffer = await fs.readFile(src);
        const expectedBuffer = await fs.readFile(expected);
        let called = 0;

        await new Promise((resolve, reject) => {
          const plugin = webp({ verbose: false });

          plugin.on('end', resolve);
          plugin.on('error', reject);

          plugin.on('data', async (file) => {
            called += 1;

            // original image
            if (called === 1) {
              assert(file.isBuffer());
              assert.deepEqual(file.contents, srcBuffer);
            }
            // webp
            else if (called === 2) {
              assert(file.isBuffer());
              assert.deepEqual(file.basename, `${basename}${extname}.webp`);
              assert.deepEqual(file.contents, expectedBuffer);

              if (DEBUG) {
                await fs.writeFile(
                  path.resolve(destDir, `${basename}${extname}.webp`),
                  file.contents
                );
              }
            }
          });

          plugin.write(
            new Vinyl({
              path: src,
              contents: Buffer.from(srcBuffer)
            })
          );
          plugin.end();
        });

        assert.equal(called, 2);
      })
    );
  });

  it('should out webp only without options.append.', async () => {
    await Promise.all(
      cases.map(async ([src, expected]) => {
        const extname = path.extname(src);
        const basename = path.basename(src, extname);
        const srcBuffer = await fs.readFile(src);
        const expectedBuffer = await fs.readFile(expected);
        let called = 0;

        await new Promise((resolve, reject) => {
          const plugin = webp({ append: false, verbose: false });

          plugin.on('end', resolve);
          plugin.on('error', reject);

          plugin.on('data', async (file) => {
            called += 1;

            // original image
            if (called === 1) {
              assert(file.isBuffer());
              assert.deepEqual(file.contents, expectedBuffer);

              if (DEBUG) {
                await fs.writeFile(
                  path.resolve(destDir, `${basename}${extname}.webp`),
                  file.contents
                );
              }
            }
          });

          plugin.write(
            new Vinyl({
              path: src,
              contents: Buffer.from(srcBuffer)
            })
          );
          plugin.end();
        });

        assert.equal(called, 1);
      })
    );
  });

  it('should out webp as "<original basename>.webp" without options.keepExtname.', async () => {
    await Promise.all(
      cases.map(async ([src, expected]) => {
        const extname = path.extname(src);
        const basename = path.basename(src, extname);
        const srcBuffer = await fs.readFile(src);
        const expectedBuffer = await fs.readFile(expected);
        let called = 0;

        await new Promise((resolve, reject) => {
          const plugin = webp({ keepExtname: false, verbose: false });

          plugin.on('end', resolve);
          plugin.on('error', reject);

          plugin.on('data', async (file) => {
            called += 1;

            // original image
            if (called === 1) {
              assert(file.isBuffer());
              assert.deepEqual(file.contents, srcBuffer);
            }
            // webp
            else if (called === 2) {
              assert(file.isBuffer());
              assert.deepEqual(file.basename, `${basename}.webp`);
              assert.deepEqual(file.contents, expectedBuffer);

              if (DEBUG) {
                await fs.writeFile(
                  path.resolve(destDir, `${basename}${extname}.webp`),
                  file.contents
                );
              }
            }
          });

          plugin.write(
            new Vinyl({
              path: src,
              contents: Buffer.from(srcBuffer)
            })
          );
          plugin.end();
        });

        assert.equal(called, 2);
      })
    );
  });

  it('should return PluginError if failed.', async () => {
    const [[src]] = cases;
    const srcBuffer = await fs.readFile(src, { encode: null });

    await new Promise((resolve) => {
      const plugin = webp({ verbose: false });

      plugin.on('finish', resolve);
      plugin.on('end', resolve);
      plugin.on('error', (error) => {
        assert(error instanceof PluginError);
      });

      plugin.on('data', () => {
        throw new Error('failed to convert.');
      });

      plugin.write(
        new Vinyl({
          path: src,
          contents: Buffer.from(srcBuffer)
        })
      );
      plugin.end();
    });
  });
});
