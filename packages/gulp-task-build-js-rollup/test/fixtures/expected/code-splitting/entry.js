/**
 * piyo
 *
 * @return {void}
 */
function piyo() {
  console.log('piyo'); // eslint-disable-line no-console
  import('./fuga.js').then(({
    default: fuga
  }) => fuga());
}

import('./hoge.js').then(({
  default: hoge
}) => {
  hoge();
});
piyo();
