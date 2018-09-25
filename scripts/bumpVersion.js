/* eslint-disable global-require, no-console, max-len, max-statements, no-magic-numbers  */

const util = require('util');
const childProcess = require('child_process');
const chalk = require('chalk');
const exec = util.promisify(childProcess.exec);

/**
 * bump version
 * @param {String} semver semver keyword
 * @return {Promise}
 */
async function bumpVersion(semver = 'patch') {
  try {
    process.stdout.write(`${chalk.cyan('>>')} run \`lerna version\` ${chalk.grey('...')}`);
    await exec(`lerna version ${semver} --force-publish --no-push --no-git-tag-version -y`);
    process.stdout.cursorTo(26);
    process.stdout.write(` ${chalk.green('done')}`);
    console.log('');

    const lernaJson = require('../lerna.json');
    const version = `v${lernaJson.version}`;
    const commitMsg = util.format(lernaJson.command.publish.message, version);

    process.stdout.write(`${chalk.cyan('>>')} prepare ${chalk.grey('...')}`);
    await exec('npm run release:prepare');
    process.stdout.cursorTo(24);
    process.stdout.write(` ${chalk.green('done')}`);
    console.log('');

    process.stdout.write(`${chalk.cyan('>>')} commit and tagging ${chalk.grey('...')}`);
    await exec('git add .');
    await exec(`git commit -m "${commitMsg}"`);
    await exec(`git tag ${version}`);
    process.stdout.cursorTo(25);
    process.stdout.write(` ${chalk.green('done')}`);
    console.log('');

    console.log(`${chalk.bold.green('success')} version to ${version}`);
  }
  catch (error) {
    console.error(error);
  }
}

bumpVersion(process.argv[2]);
