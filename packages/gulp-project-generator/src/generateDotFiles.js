import write from './write.js';
import render from './render.js';
import format from './format.js';

/* eslint-disable max-statements */
/**
 * generate dot files
 *
 * @param {String} src source path
 * @param {String} dest destination path
 * @param {OPTIONS} options command line options
 * @return {Promise}
 */
export default async function generateDotFiles(
  src = '',
  dest = '',
  options = {}
) {
  if (typeof src !== 'string') {
    throw new TypeError('Argument "src" is not string.');
  }
  if (typeof dest !== 'string') {
    throw new TypeError('Argument "dest" is not string.');
  }

  const { verbose } = options;

  if (options.conventionalCommits) {
    await render(`${src}/.commitlintrc.json.hbs`, options)
      .then((output) => format(output, { parser: 'json' }))
      .then((output) =>
        write(output, `${dest}/.commitlintrc.json`, { verbose })
      );
  }

  if (options.css && options.cssPreprocessor === 'sass') {
    await render(`${src}/.stylelintrc.json.hbs`, options)
      .then((output) => format(output, { parser: 'json' }))
      .then((output) =>
        write(output, `${dest}/.stylelintrc.json`, { verbose })
      );

    await render(`${src}/.stylelintignore.hbs`, options).then((output) =>
      write(output, `${dest}/.stylelintignore`, { verbose })
    );
  }

  if (options.js) {
    await render(`${src}/.babelrc.json.hbs`, options)
      .then((output) => format(output, { parser: 'json' }))
      .then((output) => write(output, `${dest}/.babelrc.json`, { verbose }));

    await render(`${src}/.mocharc.json.hbs`, options)
      .then((output) => format(output, { parser: 'json' }))
      .then((output) => write(output, `${dest}/.mocharc.json`, { verbose }));
  }

  await render(`${src}/eslint.config.js.hbs`, options)
    .then((output) => format(output))
    .then((output) => write(output, `${dest}/eslint.config.js`, { verbose }));

  await render(`${src}/.prettierrc.json.hbs`, options)
    .then((output) => format(output, { parser: 'json' }))
    .then((output) => write(output, `${dest}/.prettierrc.json`, { verbose }));

  await render(`${src}/.prettierignore.hbs`, options).then((output) =>
    write(output, `${dest}/.prettierignore`, { verbose })
  );

  await render(`${src}/.githooks-pre-commit.hbs`, options).then((output) =>
    write(output, `${dest}/.githooks/pre-commit`, {
      verbose,
      writeFile: { mode: parseInt('0755', 8) }
    })
  );

  if (options.conventionalCommits) {
    await render(`${src}/.githooks-commit-msg.hbs`, options).then((output) =>
      write(output, `${dest}/.githooks/commit-msg`, {
        verbose,
        writeFile: { mode: parseInt('0755', 8) }
      })
    );
  }

  await render(`${src}/.lintstagedrc.json.hbs`, options)
    .then((output) => format(output, { parser: 'json' }))
    .then((output) => write(output, `${dest}/.lintstagedrc.json`, { verbose }));

  await render(`${src}/.editorconfig.hbs`, options).then((output) =>
    write(output, `${dest}/.editorconfig`, { verbose })
  );

  await render(`${src}/.gitignore.hbs`, options).then((output) =>
    write(output, `${dest}/.gitignore`, { verbose })
  );

  await render(`${src}/.gitattributes.hbs`, options).then((output) =>
    write(output, `${dest}/.gitattributes`, { verbose })
  );
}
/* eslint-enable max-statements */
