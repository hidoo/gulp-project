/* eslint max-lines-per-function: off, max-statements: off, prefer-named-capture-group: off */

import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import chalk from 'chalk';
import program, {InvalidOptionArgumentError} from 'commander';
import inquirer from 'inquirer';
import mkdir from './mkdir.js';
import isEmptyDir from './isEmptyDir.js';
import createProjectName from './createProjectName.js';
import generatePackageJson from './generatePackageJson.js';
import generateReadme from './generateReadme.js';
import generateConfig from './generateConfig.js';
import generateGulpfile from './generateGulpfile.js';
import generateDotFiles from './generateDotFiles.js';
import generateCssFiles from './generateCssFiles.js';
import generateHtmlFiles from './generateHtmlFiles.js';
import generateImageFiles from './generateImageFiles.js';
import generateJsFiles from './generateJsFiles.js';
import generateServerFiles from './generateServerFiles.js';
import generateSpriteFiles from './generateSpriteFiles.js';
import generateStyleguideFiles from './generateStyleguideFiles.js';

/**
 * commonjs style require
 *
 * @type {Function}
 */
const require = createRequire(import.meta.url);

/**
 * package information
 *
 * @type {Object}
 */
const pkg = require('../package.json');

/**
 * return force generate or not
 *
 * @param {String} dest destination path
 * @param {Object} options command line options
 * @return {Promise<Boolean>}
 */
async function confirmForce(dest = '', options = {}) {
  if (await isEmptyDir(dest) || options.force) {
    return true;
  }

  const results = await inquirer.prompt([
    {
      'type': 'confirm',
      'name': 'confirm',
      'message': `${dest} is not empty directory, continue?`,
      'default': false
    }
  ]);

  return results.confirm;
}

/**
 * return user inputted project name
 *
 * @param {String} dest destination path
 * @param {Object} options command line options
 * @return {Promise<String>}
 */
async function inputProjectName(dest = '', options = {}) {
  if (typeof dest !== 'string' && dest === '') {
    throw new TypeError('Argument "dest" must be not empty string.');
  }

  const name = typeof options.name === 'string' && options.name !== '' ?
    options.name : createProjectName(dest);

  if (options.interactive) {
    const results = await inquirer
      .prompt([
        {
          'type': 'input',
          'name': 'name',
          'message': 'Please input name of the project.',
          'default': () => name || '',
          'transformer': (value) => createProjectName(value)
        }
      ]);

    return results.name;
  }
  return name;
}

/**
 * return user selected options
 *
 * @param {Object} options command line options
 * @return {Promise<Object>}
 */
async function selectedOptions(options = {}) {
  if (options.interactive) {
    const results = await inquirer
      .prompt([
        {
          'type': 'confirm',
          'name': 'multiDevice',
          'message': 'Enable multi-device mode?',
          'default': false,
          'when': () => !options.multiDevice
        },
        {
          'type': 'confirm',
          'name': 'conventionalCommits',
          'message': 'Set up tools for conventional commits?',
          'default': Boolean(options.conventionalCommits)
        },
        {
          type: 'checkbox',
          name: 'tasks',
          message: 'Please select the task you need for the project.',
          choices: [
            {name: 'css', checked: options.css},
            {name: 'html', checked: options.html},
            {name: 'js', checked: options.js},
            {name: 'sprite', checked: options.css && options.sprite},
            {name: 'styleguide', checked: options.css && options.styleguide},
            {name: 'image', checked: options.image},
            {name: 'server', checked: options.server}
          ],
          filter: (choices) =>
            choices.reduce(
              (prev, current) => {
                return {...prev, [current]: true};
              },
              {}
            ),
          validate(choices) {
            if (!Object.keys(choices).length) {
              return 'You must choose at least one task.';
            }
            return true;
          }
        },
        {
          type: 'checkbox',
          name: 'depsTasks',
          message: 'Please select the dependency task you need for the project.',
          choices: (answers) => [
            answers.tasks.css ? {name: 'cssDeps', checked: options.cssDeps} : null,
            answers.tasks.js ? {name: 'jsDeps', checked: options.jsDeps} : null
          ].filter((choice) => choice),
          filter: (choices) =>
            choices.reduce(
              (prev, current) => {
                return {...prev, [current]: true};
              },
              {}
            ),
          when: (answers) => answers.tasks.css || answers.tasks.js
        },
        {
          'type': 'list',
          'name': 'cssPreprocessor',
          'message': 'Please select the CSS preprocessor.',
          'choices': [
            {name: 'stylus'},
            {name: 'sass'}
          ],
          'default': () => options.cssPreprocessor,
          'when': (answers) => answers.tasks.css
        },
        {
          'type': 'list',
          'name': 'jsBundler',
          'message': 'Please select the JavaScript bundler.',
          'choices': [
            {name: 'browserify'},
            {name: 'rollup'}
          ],
          'default': () => options.jsBundler,
          'when': (answers) => answers.tasks.js
        },
        {
          'type': 'list',
          'name': 'spriteType',
          'message': 'Please select the sprite sheet source type.',
          'choices': [
            {name: 'svg'},
            {name: 'image'}
          ],
          'default': () => options.spriteType,
          'when': (answers) => answers.tasks.sprite
        }
      ]);

    return {
      force: options.force,
      interactive: options.interactive,
      multiDevice: options.multiDevice || results.multiDevice,
      conventionalCommits: results.conventionalCommits,
      ...results.tasks,
      ...results.depsTasks,
      cssPreprocessor: results.cssPreprocessor,
      jsBundler: results.jsBundler,
      spriteType: results.spriteType,
      verbose: options.verbose
    };
  }
  return options;
}

/**
 * return merged options to user choices
 *
 * @param {String} name project name
 * @param {Object} options command line options
 * @return {Promise<Object>}
 */
async function confirmConfig(name = '', options = {}) {
  if (options.interactive) {

    console.log('');
    console.log(`  ${chalk.white('Project Name:')}`);
    console.log(`    ${chalk.cyan(name)}`);

    if (options.multiDevice) {
      console.log('');
      console.log(`  ${chalk.white('Multi-device Mode:')}`);
      console.log(`    ${chalk.cyan(options.multiDevice)}`);
    }

    if (options.conventionalCommits) {
      console.log('');
      console.log(`  ${chalk.white('Use Conventional Commits:')}`);
      console.log(`    ${chalk.cyan(options.conventionalCommits)}`);
    }

    console.log('');
    console.log(`  ${chalk.white('Tasks:')}`);
    Object.keys(options)
      .sort()
      .forEach((key) => {
        if (
          key !== 'interactive' &&
          key !== 'force' &&
          key !== 'conventionalCommits' &&
          key !== 'multiDevice' &&
          key !== 'verbose' &&
          key !== 'cssPreprocessor' &&
          key !== 'jsBundler' &&
          key !== 'spriteType'
        ) {
          console.log(`    ${chalk.grey('+')} ${chalk.cyan(key)}`);
        }
      });

    if (options.css && options.cssPreprocessor) {
      console.log('');
      console.log(`  ${chalk.white('CSS Preprocessor:')}`);
      console.log(`    ${chalk.grey('+')} ${chalk.cyan(options.cssPreprocessor)}`);
    }

    if (options.js && options.jsBundler) {
      console.log('');
      console.log(`  ${chalk.white('JavaScript Bundler:')}`);
      console.log(`    ${chalk.grey('+')} ${chalk.cyan(options.jsBundler)}`);
    }

    if (options.sprite && options.spriteType) {
      console.log('');
      console.log(`  ${chalk.white('Sprite sheet type:')}`);
      console.log(`    ${chalk.grey('+')} ${chalk.cyan(options.spriteType)}`);
    }

    console.log('');

    const results = await inquirer.prompt([
      {
        'type': 'confirm',
        'name': 'confirm',
        'message': 'Is this OK?',
        'default': false
      }
    ]);

    return results.confirm;
  }
  return true;
}

/**
 * main process
 *
 * @param {String} src source path
 * @param {String} dest destination path
 * @param {Object} options command line options
 * @return {Promise}
 */
async function main(src = '', dest = '', options = {}) {
  if (typeof src !== 'string' && src === '') {
    throw new TypeError('Argument "src" must be not empty string.');
  }
  if (typeof dest !== 'string' && dest === '') {
    throw new TypeError('Argument "dest" must be not empty string.');
  }

  if (!await confirmForce(dest, options)) {
    console.log('');
    console.log(chalk.bold.yellow('Aborting.'));
    return false;
  }

  const name = await inputProjectName(dest, options),
        opts = await selectedOptions(options);

  // disable forcely in relation to --no-css
  if (!opts.css) {
    opts.cssDeps = false;
    opts.sprite = false;
    opts.styleguide = false;
  }

  // disable forcely in relation to --no-js
  if (!opts.js) {
    opts.jsDeps = false;
  }

  if (!await confirmConfig(name, opts)) {
    return main(src, dest, options);
  }

  console.log('');
  console.log(chalk.white('Prepare directories:'));
  await fs.rm(dest, {recursive: true, force: true});
  await mkdir(`${dest}/src`, {verbose: opts.verbose});
  await mkdir(`${dest}/task`, {verbose: opts.verbose});
  console.log(`${chalk.grey('...')} ${chalk.green('done')}`);

  console.log('');
  console.log(chalk.white('Generate files:'));
  await generateReadme(name, src, dest, opts);
  await generatePackageJson(name, dest, opts);
  await generateConfig(src, dest, opts);
  await generateGulpfile(src, dest, opts);
  await generateDotFiles(src, dest, opts);
  await generateCssFiles(src, dest, opts);
  await generateHtmlFiles(src, dest, opts);
  await generateImageFiles(src, dest, opts);
  await generateJsFiles(src, dest, opts);
  await generateServerFiles(src, dest, opts);
  await generateSpriteFiles(src, dest, opts);
  await generateStyleguideFiles(src, dest, opts);
  console.log(`${chalk.grey('...')} ${chalk.green('done')}`);

  console.log('');
  console.log(chalk.bold.green('New project is generated successfully.'));

  return true;
}

/**
 * select arguments
 *
 * @param {Array<String>} validValues valid values
 * @return {Function}
 */
function select(validValues = []) {
  return (value) => {
    if (!validValues.includes(value)) {
      throw new InvalidOptionArgumentError();
    }
    return value;
  };
}

program
  .version(pkg.version, '-v, --version')
  .usage('<dir> [options]')
  .option(
    '--name <name>',
    'set project name.'
  )
  .option(
    '--force',
    'Generate forcely even if <dir> is not empty.'
  )
  .option(
    '--no-interactive',
    'Disable interactive interface.'
  )
  .option(
    '--multi-device',
    'Enable multi-device mode.'
  )
  .option(
    '--conventional-commits',
    'Set up tools for conventional commits.'
  )
  .option(
    '--no-css',
    'Disable CSS build task.'
  )
  .option(
    '--no-css-deps',
    'Disable CSS dependency build task.'
  )
  .option(
    '--no-html',
    'Disable HTML build task.'
  )
  .option(
    '--no-image',
    'Disable image optimize task.'
  )
  .option(
    '--no-js',
    'Disable JavaScript build task.'
  )
  .option(
    '--no-js-deps',
    'Disable JavaScript dependency build task.'
  )
  .option(
    '--no-server',
    'Disable local dev server.'
  )
  .option(
    '--no-sprite',
    'Disable sprite sheet build task. (Enable forcely when --no-css specified.)'
  )
  .option(
    '--no-styleguide',
    'Disable styleguide build task. (Enable forcely when --no-css specified.)'
  )
  .option(
    '--css-preprocessor [lang]',
    'Select CSS preprocessor. [stylus|sass]',
    select(['stylus', 'sass']),
    'stylus'
  )
  .option(
    '--js-bundler [bundler]',
    'Select JavaScript bundler. [browserify|rollup]',
    select(['browserify', 'rollup']),
    'browserify'
  )
  .option(
    '--sprite-type [type]',
    'Select sprite sheet source type. [svg|image]',
    select(['svg', 'image']),
    'svg'
  )
  .option(
    '--verbose',
    'Enable output logs.'
  )
  .parse(process.argv);

// argument <dir> is required.
// + show help, when <dir> is not specify.
if (program.args.length) {
  const sourceDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../template'
  );
  const destDir = path.resolve(program.args[0]) || process.cwd();

  main(sourceDir, destDir, program.opts())
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
else {
  program.help();
}
