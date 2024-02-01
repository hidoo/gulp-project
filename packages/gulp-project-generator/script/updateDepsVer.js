/* eslint no-console: off */

import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {glob} from 'glob';

/**
 * update dependencies version in template/package.json
 *
 * @return {Promise}
 */
async function updateDepsVer() {
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const file = path.resolve(dirname, '../template/package.json');
  const depsFiles = await glob(
    `${path.resolve(dirname, '../../')}/{gulp,util}-*/package.json`,
    {
      ignore: '**/node_modules/**'
    }
  );
  const pkg = JSON.parse(await fs.readFile(file));
  const changes = [];

  await Promise.all(depsFiles.map(async (depsFile) => {
    const {name, version} = JSON.parse(await fs.readFile(depsFile));

    if (
      pkg.devDependencies[name] &&
      pkg.devDependencies[name] !== version
    ) {
      pkg.devDependencies[name] = version;
      changes.push([name, version]);
    }
  }));

  if (changes.length) {
    await fs.writeFile(
      file,
      `${JSON.stringify(pkg, null, '  ')}\n`
    );

    console.log(
      `Success to update dependencies version in %s\n\n%s\n`,
      'template/package.json',
      changes.map(([name, version]) => `  + ${name} -> v${version}`).join('\n')
    );
  }
}

await updateDepsVer();
