/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import Vinyl from 'vinyl';
import PluginError from 'plugin-error';
import webp from '../src';

const DEBUG = false;

describe('gulp-plugin-webp', () => {
  let cases = null;

  beforeEach(() => {
    cases = [
      [
        path.resolve(__dirname, 'fixtures/src/sample.jpg'),
        path.resolve(__dirname, 'fixtures/expected/sample.jpg.webp')
      ],
      [
        path.resolve(__dirname, 'fixtures/src/sample.png'),
        path.resolve(__dirname, 'fixtures/expected/sample.png.webp')
      ]
    ];
  });

  after(() => {
    cases = null;
  });

  it('should out original image and webp as "<original filename>.webp" if options is default.', async () => {
    await Promise.all(
      cases.map(([src, expected]) => new Promise((resolve, reject) => {
        const extname = path.extname(src);
        const basename = path.basename(src, extname);
        const srcBuffer = fs.readFileSync(src, {encode: null});
        const expectedBuffer = fs.readFileSync(expected, {encode: null});
        let called = 0;

        const fakeFile = new Vinyl({
          path: src,
          contents: Buffer.from(srcBuffer)
        });
        const plugin = webp({
          verbose: false
        });

        plugin.on('data', (file) => {
          called += 1;

          // original image
          if (called === 1) {
            assert(file.isBuffer());
            assert.deepStrictEqual(file.contents, srcBuffer);
          }
          // webp
          else if (called === 2) {
            assert(file.isBuffer());
            assert.deepStrictEqual(file.basename, `${basename}${extname}.webp`);
            assert.deepStrictEqual(file.contents, expectedBuffer);

            if (DEBUG) {
              fs.writeFileSync(
                path.resolve(__dirname, `fixtures/dest/${basename}${extname}.webp`),
                file.contents
              );
            }
          }
        });
        plugin.on('error', reject);
        plugin.on('end', () => {
          assert(called === 2);
          resolve();
        });

        plugin.write(fakeFile);
        plugin.end();
      }))
    );
  });

  it('should out webp only if options.append is false.', async () => {
    await Promise.all(
      cases.map(([src, expected]) => new Promise((resolve, reject) => {
        const extname = path.extname(src);
        const basename = path.basename(src, extname);
        const srcBuffer = fs.readFileSync(src, {encode: null});
        const expectedBuffer = fs.readFileSync(expected, {encode: null});
        let called = 0;

        const fakeFile = new Vinyl({
          path: src,
          contents: Buffer.from(srcBuffer)
        });
        const plugin = webp({
          append: false,
          verbose: false
        });

        plugin.on('data', (file) => {
          called += 1;

          // webp only
          if (called === 1) {
            assert(file.isBuffer());
            assert.deepStrictEqual(file.basename, `${basename}${extname}.webp`);
            assert.deepStrictEqual(file.contents, expectedBuffer);

            if (DEBUG) {
              fs.writeFileSync(
                path.resolve(__dirname, `fixtures/dest/${basename}${extname}.webp`),
                file.contents
              );
            }
          }
        });
        plugin.on('error', reject);
        plugin.on('end', () => {
          assert(called === 1);
          resolve();
        });

        plugin.write(fakeFile);
        plugin.end();
      }))
    );
  });

  it('should out webp as "<original basename>.webp" if options.keepExtname is false.', async () => {
    await Promise.all(
      cases.map(([src, expected]) => new Promise((resolve, reject) => {
        const extname = path.extname(src);
        const basename = path.basename(src, extname);
        const srcBuffer = fs.readFileSync(src, {encode: null});
        const expectedBuffer = fs.readFileSync(expected, {encode: null});
        let called = 0;

        const fakeFile = new Vinyl({
          path: src,
          contents: Buffer.from(srcBuffer)
        });
        const plugin = webp({
          keepExtname: false,
          verbose: false
        });

        plugin.on('data', (file) => {
          called += 1;

          // original image
          if (called === 1) {
            assert(file.isBuffer());
            assert.deepStrictEqual(file.contents, srcBuffer);
          }
          // webp
          else if (called === 2) {
            assert(file.isBuffer());
            assert.deepStrictEqual(file.contents, expectedBuffer);

            if (DEBUG) {
              fs.writeFileSync(
                path.resolve(__dirname, `fixtures/dest/${basename}${extname}.webp`),
                file.contents
              );
            }
          }
        });
        plugin.on('error', reject);
        plugin.on('end', () => {
          assert(called === 2);
          resolve();
        });

        plugin.write(fakeFile);
        plugin.end();
      }))
    );
  });

  it('should return PluginError if failed to convert wpbp.', async () => {
    await new Promise((resolve) => {
      const [src] = cases[0];
      const srcBuffer = fs.readFileSync(src, {encode: null});

      const fakeFile = new Vinyl({
        path: src,
        contents: Buffer.from(srcBuffer)
      });
      const plugin = webp({
        verbose: false
      });

      plugin.on('data', () => {
        throw new Error('failed to convert.');
      });
      plugin.on('error', (error) => {
        assert(error instanceof PluginError);
      });
      plugin.on('finish', resolve);
      plugin.write(fakeFile);
      plugin.end();
    });
  });

});
