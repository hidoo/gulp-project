/**
 * piyo
 *
 * @return {void}
 */
export default function piyo() {
  console.log('piyo'); // eslint-disable-line no-console
  import('./fuga').then(({default: fuga}) => fuga());
}
