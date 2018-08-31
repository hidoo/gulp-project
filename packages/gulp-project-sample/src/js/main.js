import sampleEsm, {getUserAgent} from './lib/sample-esm';
import sampleCjs, {getUserAgent as getUserAgentCjs} from './lib/sample-cjs';

/* eslint-disable no-console, no-process-env */
console.log(`${sampleEsm()} (${getUserAgent()})`);
console.log(`${sampleCjs()} (${getUserAgentCjs()})`);

if (process.env.NODE_ENV !== 'development') {
  console.log(`is not "development". (${process.env.NODE_ENV})`);
}
if (process.env.NODE_ENV === 'development') {
  console.log(`is "development". (${process.env.NODE_ENV})`);
}
/* eslint-enable no-console, no-process-env */
