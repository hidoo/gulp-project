/* eslint max-lines-per-function: off, max-statements: off */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import format from './format.js';
import write from './write.js';

/**
 * generate package.json
 *
 * @param {String} name project name
 * @param {String} dest destination path
 * @param {OPTIONS} options command line options
 * @return {Promise}
 */
export default async function generatePackageJson(
  name = '',
  dest = '',
  options = {}
) {
  if (typeof name !== 'string') {
    throw new TypeError('Argument "name" is not string.');
  }
  if (typeof dest !== 'string') {
    throw new TypeError('Argument "dest" is not string.');
  }

  const pkg = JSON.parse(
    await fs.readFile(
      path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        '../template/package.json'
      )
    )
  );
  const { verbose } = options;
  const scripts = [
    'start',
    'dev',
    'dev:build',
    'prepare',
    'prod',
    'prod:build',
    'static:clean',
    'static:build',
    'static:watch',
    'format',
    'test',
    'test:lint',
    'test:lint:js'
  ];
  const devDependencies = [
    '@hidoo/eslint-config',
    'chalk',
    'commander',
    'cross-env',
    'eslint',
    'gulp',
    'husky',
    'lint-staged',
    'npm-run-all',
    'prettier'
  ];

  if (options.css) {
    if (options.cssPreprocessor === 'sass') {
      scripts.push('test:lint', 'test:lint:css');
      devDependencies.push(
        '@hidoo/gulp-task-build-css-sass',
        '@hidoo/stylelint-config',
        '@hidoo/kss-builder',
        'stylelint'
      );
    } else {
      devDependencies.push('@hidoo/gulp-task-build-css-stylus');
    }
  }
  if (options.html) {
    devDependencies.push('@hidoo/gulp-task-build-html-handlebars');
  }
  if (options.image) {
    devDependencies.push('@hidoo/gulp-task-optimize-image');
  }
  if (options.js) {
    scripts.push('test:unit', 'test:unit:js');
    devDependencies.push(
      '@babel/core',
      '@babel/preset-env',
      'core-js',
      'jsdom',
      'jsdom-global',
      'mocha',
      'regenerator-runtime'
    );
    switch (options.jsBundler) {
      case 'browserify': {
        devDependencies.push('@hidoo/gulp-task-build-js-browserify');
        break;
      }
      case 'rollup': {
        devDependencies.push('@hidoo/gulp-task-build-js-rollup');
        break;
      }
      default:
    }
  }
  if (options.cssDeps || options.jsDeps) {
    devDependencies.push('@hidoo/gulp-task-concat');
  }
  if (options.server) {
    scripts.push('static:server');
    devDependencies.push(
      '@hidoo/express-engine-handlebars',
      'browser-sync',
      'express'
    );
  }
  if (options.sprite) {
    switch (options.spriteType) {
      case 'svg': {
        devDependencies.push('@hidoo/gulp-task-build-sprite-svg');
        break;
      }
      case 'image': {
        devDependencies.push('@hidoo/gulp-task-build-sprite-image');
        break;
      }
      default:
    }
  }
  if (options.styleguide) {
    devDependencies.push('@hidoo/gulp-task-build-styleguide-kss');
  }
  if (options.conventionalCommits) {
    scripts.push('version', 'version:changelog', 'version:commit');
    devDependencies.push(
      '@commitlint/cli',
      '@commitlint/config-conventional',
      'conventional-changelog-cli'
    );
  }

  const json = JSON.stringify({
    ...pkg,
    name,
    description: `${name} project. (Generated by @hidoo/gulp-project-generator)`,
    scripts: [...new Set(scripts)]
      .sort((key1, key2) => key1.localeCompare(key2))
      .map((key) => [key, pkg.scripts[key]])
      .reduce((prev, [key, command]) => {
        if (command) {
          prev[key] = command;
        }
        return prev;
      }, {}),
    devDependencies: [...new Set(devDependencies)]
      .sort((key1, key2) => key1.localeCompare(key2))
      .map((key) => [key, pkg.devDependencies[key]])
      .reduce((prev, [key, version]) => {
        if (version) {
          prev[key] = `${version}`;
        }
        return prev;
      }, {})
  });

  await write(await format(json, { parser: 'json' }), `${dest}/package.json`, {
    verbose
  });
}
