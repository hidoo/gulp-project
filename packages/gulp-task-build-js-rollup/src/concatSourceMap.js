/**
 * return source code including sourcemap that encoded to a base64
 * + include sourcemap when NODE_ENV is 'development'
 * @param {Object} result source code object generate by rollup.js
 * @return {String}
 */
export default function concatSourceMap(result = {}) {
  const {code, map} = result;
  let inline = '';

  // eslint-disable-next-line no-process-env
  if (map && process.env.NODE_ENV === 'development') {
    inline = Buffer.from(JSON.stringify(map)).toString('base64');
    inline = `//# sourceMappingURL=data:application/json;charset=utf-8;base64,${inline}`;
  }

  return `${code}${inline}`;
}
