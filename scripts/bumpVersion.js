const os = require('os');
const util = require('util');
const childProcess = require('child_process');
const chalk = require('chalk');

const exec = util.promisify(childProcess.exec);

/**
 * task
 *
 * @param {String} [label=''] task label
 * @param {Function} taskFunc callback
 * @return {Promise}
 */
async function task(label = '', taskFunc = async () => {}) { // eslint-disable-line no-empty-function
  try {
    const message = `${chalk.cyan('>>')} ${label} ${chalk.grey('...')}`;

    process.stdout.write(message);
    await taskFunc();
    process.stdout.cursorTo(label.length + 7); // eslint-disable-line no-magic-numbers
    process.stdout.write(` ${chalk.green('done')}`);
    console.log('');
  }
  catch (error) {
    console.error(error);
  }
}

/* eslint-disable max-statements */
/**
 * bump version
 *
 * @param {Array} argv process.argv
 * @return {Promise}
 */
async function bumpVersion(argv = []) {
  try {
    const [, , semver = 'patch', ...opts] = argv;
    let concurrency = os.cpus().length;

    if (opts.includes('--concurrency')) {
      concurrency = opts[opts.indexOf('--concurrency') + 1]; // eslint-disable-line no-magic-numbers
    }

    await task('build packages', async () => {
      await exec('yarn build:packages');
    });
    await task('test packages', async () => {
      await exec('yarn test:lint');
      await exec(`yarn test:packages --concurrency ${concurrency}`);
    });
    await task(`bump version to ${semver}`, async () => {
      await exec(`lerna version ${semver} --force-publish --no-push --no-git-tag-version -y`);
    });
    await task('build examples', async () => {
      await exec('yarn build:examples');
      await exec('lerna bootstrap');
    });
    await task('test examples', async () => {
      await exec('yarn test:examples');
    });

    const lernaJson = require('../lerna.json'); // eslint-disable-line global-require
    const version = `v${lernaJson.version}`;
    const commitMsg = util.format(lernaJson.command.publish.message, version);

    await task('commit and tagging', async () => {
      await exec('git add .');
      await exec(`git commit -m "${commitMsg}"`);
      await exec(`git tag ${version}`);
    });

    console.log(`${chalk.bold.green('success')} version to ${version}`);
  }
  catch (error) {
    console.error(error);
  }
}
/* eslint-enable max-statements */

bumpVersion(process.argv);
