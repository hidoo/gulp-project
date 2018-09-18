/* eslint-disable max-len, max-statements, no-console */

import path from 'path';
import chalk from 'chalk';
import program from 'commander';
import inquirer from 'inquirer';
import rimraf from 'rimraf';
import mkdir from './mkdir';
import isEmptyDir from './isEmptyDir';
import createProjectName from './createProjectName';
import generatePackageJson from './generatePackageJson';
import generateReadme from './generateReadme';
import generateConfig from './generateConfig';
import generateGulpfile from './generateGulpfile';
import generateDotFiles from './generateDotFiles';
import generateCssFiles from './generateCssFiles';
import generateHtmlFiles from './generateHtmlFiles';
import generateImageFiles from './generateImageFiles';
import generateJsFiles from './generateJsFiles';
import generateServerFiles from './generateServerFiles';
import generateSpriteFiles from './generateSpriteFiles';
import generateStyleguideFiles from './generateStyleguideFiles';
import pkg from '../package.json';

/**
 * return force generate or not
 * @param {String} dest destination path
 * @param {Object} options command line options
 * @return {Promise<Boolean>}
 */
async function comfirmForce(dest = '', options = {}) {
  try {
    if (await isEmptyDir(dest) || options.force) {
      return true;
    }

    const results = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `${dest} is not empty directory, continue?`,
        default: false
      }
    ]);

    return results.confirm;
  }
  catch (error) {
    throw error;
  }
}

/**
 * return user inputted project name
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

  try {
    if (options.interactive) {
      const results = await inquirer
        .prompt([
          {
            type: 'input',
            name: 'name',
            message: 'Please input name of the project.',
            default: () => name || '',
            transformer: (value) => createProjectName(value)
          }
        ]);

      return results.name;
    }
    return name;
  }
  catch (error) {
    throw error;
  }
}

/**
 * return user choiced options
 * @param {Object} options command line options
 * @return {Promise<Object>}
 */
async function choiseOptions(options = {}) {
  try {
    if (options.interactive) {
      const results = await inquirer
        .prompt([
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
            filter: (choices) => choices.reduce((prev, current) => ({...prev, [current]: true}), {}),
            validate: (choices) => {
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
            filter: (choices) => choices.reduce((prev, current) => ({...prev, [current]: true}), {}),
            when: (answers) => answers.tasks.css || answers.tasks.js
          },
          {
            type: 'list',
            name: 'jsBundler',
            message: 'Please select the JavaScript bundler.',
            choices: [
              {name: 'browserify'},
              {name: 'rollup'}
            ],
            default: () => options.jsBundler,
            when: (answers) => answers.tasks.js
          },
          {
            type: 'list',
            name: 'spriteType',
            message: 'Please select the sprite sheet source type.',
            choices: [
              {name: 'svg'},
              {name: 'image'}
            ],
            default: () => options.spriteType,
            when: (answers) => answers.tasks.sprite
          }
        ]);

      return {
        force: options.force,
        interactive: options.interactive,
        ...results.tasks,
        ...results.depsTasks,
        jsBundler: results.jsBundler,
        spriteType: results.spriteType,
        verbose: options.verbose
      };
    }
    return options;
  }
  catch (error) {
    throw error;
  }
}

/**
 * return merged options to user choices
 * @param {String} name project name
 * @param {Object} options command line options
 * @return {Promise<Object>}
 */
async function confirmConfig(name = '', options = {}) {
  try {
    if (options.interactive) {

      console.log('');
      console.log(`  ${chalk.white('Project Name:')}`);
      console.log(`    ${chalk.cyan(name)}`);

      console.log('');
      console.log(`  ${chalk.white('Tasks:')}`);
      Object.keys(options).sort().forEach((key) => {
        if (
          key !== 'interactive' &&
          key !== 'force' &&
          key !== 'verbose' &&
          key !== 'jsBundler' &&
          key !== 'spriteType'
        ) {
          console.log(`    ${chalk.grey('+')} ${chalk.cyan(key)}`);
        }
      });

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
          type: 'confirm',
          name: 'confirm',
          message: 'Is this OK?',
          default: false
        }
      ]);

      return results.confirm;
    }
    return true;
  }
  catch (error) {
    throw error;
  }
}

/**
 * main process
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

  try {
    if (!await comfirmForce(dest, options)) {
      console.log('');
      console.log(chalk.bold.yellow('Aborting.'));
      return false;
    }

    const name = await inputProjectName(dest, options),
          opts = await choiseOptions(options);

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
    rimraf.sync(dest);
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
  catch (error) {
    throw error;
  }
}

program
  .version(pkg.version, '-v, --version')
  .usage('<dir> [options]')
  .option('--name <name>', 'set project name.')
  .option('--force', 'Generate forcely even if <dir> is not empty.')
  .option('--no-interactive', 'Disable interactive interface.')
  .option('--no-css', 'Disable CSS build task.')
  .option('--no-css-deps', 'Disable CSS dependency build task.')
  .option('--no-html', 'Disable HTML build task.')
  .option('--no-image', 'Disable image optimize task.')
  .option('--no-js', 'Disable JavaScript build task.')
  .option('--no-js-deps', 'Disable JavaScript dependency build task.')
  .option('--no-server', 'Disable local dev server.')
  .option('--no-sprite', 'Disable sprite sheet build task. (Enable forcely when --no-css specified.)')
  .option('--no-styleguide', 'Disable styleguide build task. (Enable forcely when --no-css specified.)')
  .option('--js-bundler [bundler]', 'Select JavaScript bundler. [browserify|rollup]', /^(browserify|rollup)$/, 'browserify')
  .option('--sprite-type [type]', 'Select sprite sheet source type. [svg|image]', /^(svg|image)$/, 'svg')
  .option('--verbose', 'Enable output logs.')
  .parse(process.argv);

// argument <dir> is required.
// + show help, when <dir> is not specify.
if (program.args.length) {
  const sourceDir = path.resolve(__dirname, '../template'),
        destDir = path.resolve(program.args[0]) || process.cwd();

  main(sourceDir, destDir, program.opts())
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}
else {
  program.help();
}
