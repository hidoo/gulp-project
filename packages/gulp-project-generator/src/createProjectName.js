import path from 'node:path';

/**
 * create project name from project basename
 *
 * @param {String} dirname path name
 * @return {String}
 */
export default function createProjectName(dirname = '') {
  const basename = path.basename(dirname);

  return basename
    .replace(/[^a-zA-Z0-9-.]/g, '-')
    .replace(/^[-.]+$/g, '')
    .replace(/^[-.]/, '')
    .replace(/[-.]$/, '')
    .toLowerCase();
}
