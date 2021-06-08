/* eslint max-lines-per-function: off, max-len: off, max-statements: off */

import pkg from '../package.json';
import write from './write';

/**
 * generate package.json
 *
 * @param {String} name project name
 * @param {String} dest destination path
 * @param {OPTIONS} options command line options
 * @return {Promise}
 */
export default async function generatePackageJson(name = '', dest = '', options = {}) {
  if (typeof name !== 'string') {
    throw new TypeError('Argument "name" is not string.');
  }
  if (typeof dest !== 'string') {
    throw new TypeError('Argument "dest" is not string.');
  }

  const gulpProjectVersion = `^${pkg.version}`;

  const devDependencies = [
          {name: '@babel/core', version: '^7.14.3'},
          {name: '@babel/preset-env', version: '^7.14.4'},
          {name: '@babel/register', version: '^7.13.16'},
          {name: '@hidoo/eslint-config', version: '^0.6.0'},
          {name: '@hidoo/util-fancy-print', version: gulpProjectVersion},
          {name: 'commander', version: '^7.2.0'},
          {name: 'cross-env', version: '^7.0.3'},
          {name: 'eslint', version: '^7.28.0'},
          {name: 'gulp', version: '^4.0.2'},
          {name: 'husky', version: '^6.0.0'},
          {name: 'lint-staged', version: '^11.0.0'},
          {name: 'npm-run-all', version: '^4.1.5'},
          {name: 'rimraf', version: '^3.0.2'}
        ],
        scripts = [
          {name: 'start', command: 'npm run dev'},
          {name: 'dev', command: 'cross-env NODE_ENV=development gulp'},
          {name: 'dev:build', command: 'cross-env NODE_ENV=development npm-run-all -s static:clean static:build'},
          {name: 'prepare', command: 'husky install'},
          {name: 'prod', command: 'cross-env NODE_ENV=production gulp'},
          {name: 'prod:build', command: 'cross-env NODE_ENV=production npm-run-all -s static:clean static:build'},
          {name: 'static:clean', command: 'gulp clean'},
          {name: 'static:build', command: 'gulp build'},
          {name: 'static:watch', command: 'gulp watch'},
          {name: 'test', command: 'npm-run-all -s test:*'},
          {name: 'test:lint', command: 'npm-run-all -s test:lint:*'},
          {name: 'test:lint:js', command: 'eslint .'}
        ],
        {verbose} = options;

  if (options.css) {
    if (options.cssPreprocessor === 'sass') {
      devDependencies.push(
        {name: '@hidoo/gulp-task-build-css-sass', version: gulpProjectVersion},
        {name: '@hidoo/stylelint-config', version: '^0.4.4'},
        {name: '@hidoo/kss-builder', version: '^0.4.4'},
        {name: 'stylelint', version: '^13.2.0'}
      );
      scripts.push(
        {name: 'test:lint:css', command: 'stylelint --syntax scss ./**/*.scss'}
      );
    }
    else {
      devDependencies.push(
        {name: '@hidoo/gulp-task-build-css-stylus', version: gulpProjectVersion}
      );
    }
  }
  if (options.cssDeps) {
    devDependencies.push(
      {name: '@hidoo/gulp-task-concat', version: gulpProjectVersion}
    );
  }
  if (options.html) {
    devDependencies.push(
      {name: '@hidoo/gulp-task-build-html-handlebars', version: gulpProjectVersion}
    );
  }
  if (options.image) {
    devDependencies.push(
      {name: '@hidoo/gulp-task-optimize-image', version: gulpProjectVersion}
    );
  }
  if (options.js) {
    devDependencies.push(
      {name: 'babel-preset-power-assert', version: '^3.0.0'},
      {name: 'core-js', version: '^3.14.0'},
      {name: 'jsdom', version: '^16.2.0'},
      {name: 'jsdom-global', version: '^3.0.2'},
      {name: 'mocha', version: '^8.4.0'},
      {name: 'power-assert', version: '^1.6.1'},
      {name: 'regenerator-runtime', version: '^0.13.7'}
    );
    scripts.push(
      {name: 'test:unit', command: 'cross-env NODE_ENV=test mocha ./src/js/**/*.test.js'}
    );
    switch (options.jsBundler) {
      case 'browserify':
        devDependencies.push(
          {name: '@hidoo/gulp-task-build-js-browserify', version: gulpProjectVersion}
        );
        break;
      case 'rollup':
        devDependencies.push(
          {name: '@hidoo/gulp-task-build-js-rollup', version: gulpProjectVersion}
        );
        break;
      default:
    }
  }
  if (options.jsDeps) {
    devDependencies.push(
      {name: '@hidoo/gulp-task-concat', version: gulpProjectVersion}
    );
  }
  if (options.server) {
    devDependencies.push(
      {name: '@hidoo/express-engine-handlebars', version: '^0.8.1'},
      {name: '@hidoo/util-local-ip', version: gulpProjectVersion},
      {name: 'browser-sync', version: '^2.26.7'},
      {name: 'express', version: '^4.17.1'}
    );
    scripts.push(
      {name: 'static:server', command: 'gulp server'}
    );
  }
  if (options.sprite) {
    switch (options.spriteType) {
      case 'svg':
        devDependencies.push(
          {name: '@hidoo/gulp-task-build-sprite-svg', version: gulpProjectVersion}
        );
        break;
      case 'image':
        devDependencies.push(
          {name: '@hidoo/gulp-task-build-sprite-image', version: gulpProjectVersion}
        );
        break;
      default:
    }
  }
  if (options.styleguide) {
    devDependencies.push(
      {name: '@hidoo/gulp-task-build-styleguide-kss', version: gulpProjectVersion}
    );
  }
  if (options.conventionalCommits) {
    devDependencies.push(
      {name: '@commitlint/cli', version: '^12.1.4'},
      {name: '@commitlint/config-conventional', version: '^12.1.4'},
      {name: 'conventional-changelog-cli', version: '^2.0.5'}
    );
    scripts.push(
      {name: 'version', command: 'npm-run-all -s test prod:build version:changelog version:commit'},
      {name: 'version:changelog', command: 'conventional-changelog -p angular -i ./CHANGELOG.md -s -r 0'},
      {name: 'version:commit', command: 'git add .'}
    );
  }

  const json = {
    'name': name,
    'version': '0.0.0',
    'description': `${name} project. (Generated by @hidoo/gulp-project-generator)`,
    'private': true,
    'author': '',
    'files': [],
    'engines': {
      node: '>=12.0.0',
      npm: '>=6.0.0'
    },
    /* eslint-disable id-length */
    'scripts': scripts
      .sort((a, b) => a.name.localeCompare(b.name))
      .reduce((prev, current) => {
        return {...prev, [current.name]: current.command};
      }, {}),
    'devDependencies': devDependencies
      .sort((a, b) => a.name.localeCompare(b.name))
      .reduce((prev, current) => {
        return {...prev, [current.name]: current.version};
      }, {}),
    'dependencies': {}
    /* eslint-enable id-length */
  };

  await write(JSON.stringify(json, null, '  '), `${dest}/package.json`, {verbose});
}
