/* eslint no-console: off, no-process-env: off*/

import sampleEsm from './lib/sample-esm';
import sampleCjs from './lib/sample-cjs';

console.log(`${sampleEsm()}`);
console.log(`${sampleCjs()}`);

if (process.env.NODE_ENV !== 'development') {
  console.log(`is not "development". (${process.env.NODE_ENV})`);
}
if (process.env.NODE_ENV === 'development') {
  console.log(`is "development". (${process.env.NODE_ENV})`);
}
