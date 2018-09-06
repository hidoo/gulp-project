/* eslint max-len: 0, no-magic-numbers: 0 */

import fs from 'fs';
import assert from 'assert';
import rimraf from 'rimraf';
import Vinyl from 'vinyl';
import {globPromise, readFile, readFiles} from '../src/util';

describe('util', () => {
  const path = {
    src: `${__dirname}/fixtures/src`,
    notAccessible: `${__dirname}/fixtures/__NOT_ACCESSIBLE__`
  };

  before(() => {
    fs.mkdirSync(path.notAccessible);
    fs.mkdirSync(`${path.notAccessible}/target`, 0);
  });

  after((done) => {
    rimraf(path.notAccessible, done);
  });

  describe('globPromise', () => {

    it('should return Promise<Array> that includes empty array if argument "pattern" is not accessible.', async () => {
      const filepaths = await globPromise(`${path.notAccessible}/target/**/*.txt`, {silent: true});

      assert(Array.isArray(filepaths));
      assert(filepaths.length === 0);
    });

    it('should return Promise<Array> that includes empty array if argument "pattern" matched files not readed.', async () => {
      const filepaths = await globPromise(`${path.src}/not_exists_*.txt`, {silent: true});

      assert(Array.isArray(filepaths));
      assert(filepaths.length === 0);
    });

    it('should return Promise<Array> that includes empty array if argument "pattern" matched files not readed.', async () => {
      const filepaths = await globPromise(`${path.src}/exists_*.txt`, {silent: true});

      assert(Array.isArray(filepaths));
      assert(filepaths.length > 0);
      filepaths.forEach((filepath) => assert(typeof filepath === 'string'));
    });

  });

  describe('readFile', () => {

    it('should return Promise<Vinyl> that includes "error" if argument "filepath" could not readed.', async () => {
      const file = await readFile(`${path.src}/not_exists_file.txt`);

      assert(Vinyl.isVinyl(file));
      assert(file.error instanceof Error);
      assert(file.contents === null);
    });

    it('should return Promise<Vinyl> that includes "contents" if argument "filepath" readed.', async () => {
      const file = await readFile(`${path.src}/exists_file.txt`);

      assert(Vinyl.isVinyl(file));
      assert(typeof file.error === 'undefined');
      assert(file.contents);
    });

  });

  describe('readFiles', () => {

    it('should return Promise<Array> that includes empty array if argument "pattern" is not accessible.', async () => {
      const files = await readFiles(`${path.notAccessible}/target/**/*.txt`);

      assert(Array.isArray(files));
      assert(files.length === 0);
    });

    it('should return Promise<Array> that includes empty array if argument "pattern" matched files not readed.', async () => {
      const files = await readFiles(`${path.src}/not_exists_*.txt`);

      assert(Array.isArray(files));
      assert(files.length === 0);
    });

    it('should return Promise<Array<Vinyl>> that includes array of Vinyl if argument "pattern" matched files readed.', async () => {
      const files = await readFiles(`${path.src}/exists_*.txt`);

      assert(Array.isArray(files));
      assert(files.length > 0);
      files.forEach((file) => {
        assert(Vinyl.isVinyl(file));
        assert(typeof file.error === 'undefined');
        assert(file.contents);
      });
    });

  });

});
