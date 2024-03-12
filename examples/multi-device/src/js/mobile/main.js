/* eslint no-console: off */

import sampleEsm from './lib/sample-esm/index.js';
import sampleCjs from './lib/sample-cjs/index.cjs';

console.log(`${sampleEsm()}`);
console.log(`${sampleCjs()}`);

if (process.env.NODE_ENV !== 'development') {
  console.log(`is not "development". (${process.env.NODE_ENV})`);
}
if (process.env.NODE_ENV === 'development') {
  console.log(`is "development". (${process.env.NODE_ENV})`);
}
