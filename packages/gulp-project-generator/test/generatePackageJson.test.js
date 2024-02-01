import assert from 'node:assert';
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import generatePackageJson from '../src/generatePackageJson.js';

/**
 * read built file
 *
 * @param {String} file filename
 * @return {String}
 */
async function readBuiltFile(file) {
  const content = await fs.readFile(file);

  return content.toString().trim()
    .replace(
      /"(@hidoo\/(gulp|util)-[^"]+)":\s"[^"]+"/g, // eslint-disable-line prefer-named-capture-group
      '"$1": "<version>"'
    );
}

describe('generatePackageJson', () => {
  let dirname = null;
  let fixturesDir = null;
  let destDir = null;
  let expectedDir = null;

  before(() => {
    dirname = path.dirname(fileURLToPath(import.meta.url));
    fixturesDir = path.resolve(dirname, 'fixtures');
    destDir = path.resolve(fixturesDir, 'dest');
    expectedDir = path.resolve(fixturesDir, 'expected');
  });

  afterEach(async () => {
    await fs.rm(destDir, {recursive: true});
    await fs.mkdir(destDir);
  });

  it('should return Promise.', (done) => {
    const actual = generatePackageJson('hoge-project', destDir, {});

    assert(actual instanceof Promise);
    actual.then(() => done());
  });

  it('should generate package.json.', async () => {
    await generatePackageJson('hoge-project', destDir, {
      css: true,
      cssDeps: true,
      html: true,
      image: true,
      js: true,
      jsDeps: true,
      server: true,
      sprite: true,
      styleguide: true,
      jsBundler: 'browserify',
      spriteType: 'svg'
    });

    const actual = await readBuiltFile(`${destDir}/package.json`);
    const expected = await readBuiltFile(`${expectedDir}/pkg.json`);

    assert(actual);
    assert.deepEqual(actual, expected);
  });

  it('should generate package.json if argument options.conventionalCommits is true.', async () => {
    await generatePackageJson('hoge-project', destDir, {
      css: true,
      cssDeps: true,
      html: true,
      image: true,
      js: true,
      jsDeps: true,
      server: true,
      sprite: true,
      styleguide: true,
      jsBundler: 'browserify',
      spriteType: 'svg',
      conventionalCommits: true
    });

    const actual = await readBuiltFile(`${destDir}/package.json`);
    const expected = await readBuiltFile(`${expectedDir}/pkg-conventional-commits.json`);

    assert(actual);
    assert.deepEqual(actual, expected);
  });

  it('should generate package.json if argument options.css is true and options.cssPreprocessor is "sass".', async () => {
    await generatePackageJson('hoge-project', destDir, {
      css: true,
      cssDeps: true,
      html: true,
      image: true,
      js: true,
      jsDeps: true,
      server: true,
      sprite: true,
      styleguide: true,
      jsBundler: 'browserify',
      spriteType: 'svg',
      cssPreprocessor: 'sass'
    });

    const actual = await readBuiltFile(`${destDir}/package.json`);
    const expected = await readBuiltFile(`${expectedDir}/pkg-sass.json`);

    assert(actual);
    assert.deepEqual(actual, expected);
  });

});
