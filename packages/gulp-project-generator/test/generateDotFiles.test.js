import assert from 'node:assert';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import generateDotFiles from '../src/generateDotFiles.js';

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

describe('generateDotFiles', () => {
  let dirname = null;
  let fixturesDir = null;
  let srcDir = null;
  let destDir = null;
  let expectedDir = null;

  before(() => {
    dirname = path.dirname(fileURLToPath(import.meta.url));
    fixturesDir = path.resolve(dirname, 'fixtures');
    srcDir = path.resolve(dirname, '../template');
    destDir = path.resolve(fixturesDir, 'dest');
    expectedDir = path.resolve(fixturesDir, 'expected');
  });

  afterEach(async () => {
    await fs.rm(destDir, { recursive: true });
    await fs.mkdir(destDir);
  });

  it('should return Promise.', (done) => {
    const actual = generateDotFiles(srcDir, destDir, {});

    assert(actual instanceof Promise);
    actual.then(() => done());
  });

  it('should generate dot files.', async () => {
    await generateDotFiles(srcDir, destDir, {
      css: true,
      html: true,
      image: true,
      js: true,
      server: true,
      sprite: true,
      styleguide: true
    });

    const files = [
      ['.babelrc.json', '.babelrc-main.json'],
      ['.editorconfig', '.editorconfig'],
      ['.eslintignore', '.eslintignore'],
      ['.eslintrc.json', '.eslintrc-main.json'],
      ['.prettierignore', '.prettierignore'],
      ['.prettierrc.json', '.prettierrc-main.json'],
      ['.gitattributes', '.gitattributes'],
      ['.gitignore', '.gitignore-main'],
      ['.githooks/pre-commit', '.githooks-pre-commit'],
      ['.lintstagedrc.json', '.lintstagedrc-main.json'],
      ['.mocharc.json', '.mocharc-main.json']
    ];

    await Promise.all(
      files.map(async (file) => {
        const actual = await readBuiltFile(`${destDir}/${file[0]}`);
        const expected = await readBuiltFile(`${expectedDir}/${file[1]}`);

        assert(actual, `should generate ${file}.`);
        assert.deepStrictEqual(actual, expected);
      })
    );
  });

  it('should generate dot files if argument options.multiDevice is true.', async () => {
    await generateDotFiles(srcDir, destDir, {
      css: true,
      html: true,
      image: true,
      js: true,
      server: true,
      sprite: true,
      styleguide: true,
      multiDevice: true
    });

    const files = [
      ['.babelrc.json', '.babelrc-main.json'],
      ['.editorconfig', '.editorconfig'],
      ['.eslintignore', '.eslintignore'],
      ['.eslintrc.json', '.eslintrc-main.json'],
      ['.prettierignore', '.prettierignore'],
      ['.prettierrc.json', '.prettierrc-main.json'],
      ['.gitattributes', '.gitattributes'],
      ['.gitignore', '.gitignore-main'],
      ['.githooks/pre-commit', '.githooks-pre-commit'],
      ['.lintstagedrc.json', '.lintstagedrc-main.json'],
      ['.mocharc.json', '.mocharc-main.json']
    ];

    await Promise.all(
      files.map(async (file) => {
        const actual = await readBuiltFile(`${destDir}/${file[0]}`);
        const expected = await readBuiltFile(`${expectedDir}/${file[1]}`);

        assert(actual, `should generate ${file}.`);
        assert.deepStrictEqual(actual, expected);
      })
    );
  });

  it('should generate dot files if argument options.conventionalCommits is true.', async () => {
    await generateDotFiles(srcDir, destDir, {
      css: true,
      html: true,
      image: true,
      js: true,
      server: true,
      sprite: true,
      styleguide: true,
      conventionalCommits: true
    });

    const files = [
      ['.babelrc.json', '.babelrc-main.json'],
      ['.commitlintrc.json', '.commitlintrc-main.json'],
      ['.editorconfig', '.editorconfig'],
      ['.eslintignore', '.eslintignore'],
      ['.eslintrc.json', '.eslintrc-main.json'],
      ['.prettierignore', '.prettierignore'],
      ['.prettierrc.json', '.prettierrc-main.json'],
      ['.gitattributes', '.gitattributes-conventional-commits'],
      ['.gitignore', '.gitignore-main'],
      ['.githooks/commit-msg', '.githooks-commit-msg'],
      ['.githooks/pre-commit', '.githooks-pre-commit'],
      ['.lintstagedrc.json', '.lintstagedrc-main.json'],
      ['.mocharc.json', '.mocharc-main.json']
    ];

    await Promise.all(
      files.map(async (file) => {
        const actual = await readBuiltFile(`${destDir}/${file[0]}`);
        const expected = await readBuiltFile(`${expectedDir}/${file[1]}`);

        assert(actual, `should generate ${file}.`);
        assert.deepStrictEqual(actual, expected);
      })
    );
  });

  it('should generate dot files if argument options.css is true and options.cssPreprocessor is "sass".', async () => {
    await generateDotFiles(srcDir, destDir, {
      css: true,
      html: true,
      image: true,
      js: true,
      server: true,
      sprite: true,
      styleguide: true,
      cssPreprocessor: 'sass'
    });

    const files = [
      ['.babelrc.json', '.babelrc-main.json'],
      ['.editorconfig', '.editorconfig-sass'],
      ['.eslintignore', '.eslintignore'],
      ['.eslintrc.json', '.eslintrc-main.json'],
      ['.prettierignore', '.prettierignore'],
      ['.prettierrc.json', '.prettierrc-main.json'],
      ['.gitattributes', '.gitattributes-sass'],
      ['.gitignore', '.gitignore-sass'],
      ['.githooks/pre-commit', '.githooks-pre-commit'],
      ['.lintstagedrc.json', '.lintstagedrc-sass.json'],
      ['.mocharc.json', '.mocharc-main.json'],
      ['.stylelintignore', '.stylelintignore'],
      ['.stylelintrc.json', '.stylelintrc-main.json']
    ];

    await Promise.all(
      files.map(async (file) => {
        const actual = await readBuiltFile(`${destDir}/${file[0]}`);
        const expected = await readBuiltFile(`${expectedDir}/${file[1]}`);

        assert(actual, `should generate ${file}.`);
        assert.deepStrictEqual(actual, expected);
      })
    );
  });

  it('should generate dot files if argument options.json is false.', async () => {
    await generateDotFiles(srcDir, destDir, {
      css: true,
      html: true,
      image: true,
      js: false,
      server: true,
      sprite: true,
      styleguide: true
    });

    const files = [
      ['.editorconfig', '.editorconfig'],
      ['.eslintignore', '.eslintignore'],
      ['.eslintrc.json', '.eslintrc-no-js.json'],
      ['.prettierignore', '.prettierignore'],
      ['.prettierrc.json', '.prettierrc-main.json'],
      ['.gitattributes', '.gitattributes'],
      ['.gitignore', '.gitignore-main'],
      ['.githooks/pre-commit', '.githooks-pre-commit'],
      ['.lintstagedrc.json', '.lintstagedrc-main.json']
    ];

    await Promise.all(
      files.map(async (file) => {
        const actual = await readBuiltFile(`${destDir}/${file[0]}`);
        const expected = await readBuiltFile(`${expectedDir}/${file[1]}`);

        assert(actual, `should generate ${file}.`);
        assert.deepStrictEqual(actual, expected);
      })
    );
  });
});
