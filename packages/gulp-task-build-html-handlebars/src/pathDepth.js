/**
 * return path depth string from path string
 *
 * @param {String} path path string
 * @return {String}
 */
export default function pathDepth(path = '') {
  if (typeof path !== 'string') {
    throw new TypeError('Argument "path" is not string.');
  }

  // return it as is, if absolute path
  if ((/^\//).test(path)) {
    return path;
  }

  const depthCount = (path.match(/\//g) || []).length;

  return Array.from(Array(depthCount))
    .map(() => '../')
    .join('') || './';
}
