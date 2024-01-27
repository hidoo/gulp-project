/**
 * hoga
 *
 * @return {void}
 */
function hoga() {
  console.log('hoga'); // eslint-disable-line no-console
}

/**
 * hoge
 *
 * @return {void}
 */
function hoge() {
  hoga();
  console.log('hoge'); // eslint-disable-line no-console
}

export { hoge as default };
