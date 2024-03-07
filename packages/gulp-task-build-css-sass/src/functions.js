/* eslint node/no-process-env: off, import/no-anonymous-default-export: off */
import * as sass from 'sass';

/**
 * get environment variable by name
 *
 * @param {import('sass').SassArgumentList} args argument list
 * @return {import('sass').SassString}
 */
function env(args) {
  const name = args[0].assertString('name');

  return new sass.SassString(process.env[name.text] || '');
}

export default {
  'env($name)': env
};
