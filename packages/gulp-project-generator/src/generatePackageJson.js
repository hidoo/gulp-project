/* eslint-disable max-len, max-statements */

import write from './write';
import pkg from '../package.json';

/**
 * generate package.json
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
          {name: '@babel/core', version: '^7.1.2'},
          {name: '@babel/preset-env', version: '^7.1.0'},
          {name: '@babel/register', version: '^7.0.0'},
          {name: '@hidoo/eslint-config', version: '^0.1.3'},
          {name: '@hidoo/util-fancy-print', version: gulpProjectVersion},
          {name: 'babel-eslint', version: '^10.0.1'},
          {name: 'commander', version: '^2.19.0'},
          {name: 'cross-env', version: '^5.2.0'},
          {name: 'eslint', version: '^5.6.0'},
          {name: 'gulp', version: '^4.0.0'},
          {name: 'husky', version: '^1.1.2'},
          {name: 'lint-staged', version: '^7.3.0'},
          {name: 'npm-run-all', version: '^4.1.3'},
          {name: 'rimraf', version: '^2.6.2'}
        ],
        scripts = [
          {name: 'start', command: 'npm run dev'},
          {name: 'dev', command: 'cross-env NODE_ENV=development gulp'},
          {name: 'dev:build', command: 'cross-env NODE_ENV=development npm-run-all -s static:clean static:build'},
          {name: 'prod', command: 'cross-env NODE_ENV=production gulp'},
          {name: 'prod:build', command: 'cross-env NODE_ENV=production npm-run-all -s static:clean static:build'},
          {name: 'static:clean', command: 'gulp clean'},
          {name: 'static:build', command: 'gulp build'},
          {name: 'static:watch', command: 'gulp watch'},
          {name: 'test', command: 'npm-run-all -s test:*'},
          {name: 'test:lint', command: 'eslint .'}
        ],
        huskyHooks = [
          {name: 'pre-commit', command: 'lint-staged'}
        ],
        {verbose} = options;

  if (options.css) {
    devDependencies.push(
      {name: '@hidoo/gulp-task-build-css-stylus', version: gulpProjectVersion}
    );
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
      {name: '@babel/polyfill', version: '^7.0.0'},
      {name: 'babel-preset-power-assert', version: '^3.0.0'},
      {name: 'jsdom', version: '^12.2.0'},
      {name: 'jsdom-global', version: '^3.0.2'},
      {name: 'mocha', version: '^5.2.0'},
      {name: 'power-assert', version: '^1.6.1'}
    );
    scripts.push(
      {name: 'test:unit', command: 'cross-env NODE_ENV=test mocha ./src/js/**/*.test.js --opts ./src/js/mocha.opts'}
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
      {name: '@hidoo/express-engine-handlebars', version: '^0.1.5'},
      {name: '@hidoo/util-local-ip', version: gulpProjectVersion},
      {name: 'browser-sync', version: '^2.26.3'},
      {name: 'express', version: '^4.16.4'}
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
      {name: '@hidoo/gulp-task-build-styleguide-kss', version: gulpProjectVersion},
      {name: '@hidoo/gulp-task-copy', version: gulpProjectVersion}
    );
  }
  if (options.conventionalCommits) {
    devDependencies.push(
      {name: '@commitlint/cli', version: '^7.2.1'},
      {name: '@commitlint/config-conventional', version: '^7.1.2'},
      {name: 'conventional-changelog-cli', version: '^2.0.5'}
    );
    scripts.push(
      {name: 'version', command: 'npm-run-all -s version:changelog version:commit'},
      {name: 'version:changelog', command: 'conventional-changelog -p angular -i ./CHANGELOG.md -s -r 0'},
      {name: 'version:commit', command: 'git add ./CHANGELOG.md'}
    );
    huskyHooks.push(
      {name: 'commit-msg', command: 'commitlint -E HUSKY_GIT_PARAMS'}
    );
  }

  const json = {
    name: name,
    version: '0.0.0',
    description: `${name} project. (Generated by @hidoo/gulp-project-generator)`,
    private: true,
    author: '',
    main: 'gulpfile.babel.js',
    engines: {
      node: '>=8.0.0',
      npm: '>=5.0.0'
    },
    scripts: scripts
      .sort((a, b) => a.name.localeCompare(b.name))
      .reduce((prev, current) => ({...prev, [current.name]: current.command}), {}),
    devDependencies: devDependencies
      .sort((a, b) => a.name.localeCompare(b.name))
      .reduce((prev, current) => ({...prev, [current.name]: current.version}), {}),
    dependencies: {},
    husky: {
      hooks: huskyHooks
        .sort((a, b) => a.name.localeCompare(b.name))
        .reduce((prev, current) => ({...prev, [current.name]: current.command}), {})
    },
    'lint-staged': {
      '**/*.js': [
        'eslint'
      ]
    }
  };

  try {
    await write(JSON.stringify(json, null, '  '), `${dest}/package.json`, {verbose});
  }
  catch (error) {
    throw error;
  }
}
