/* eslint max-len: 0, no-magic-numbers: 0 */

import assert from 'assert';
import ipRegex from 'ip-regex';
import getLocalIps from '../src';

describe('getLocalIps', () => {

  it('should return array of local ip address.', () => {
    const results = getLocalIps();

    assert(results);
    assert(Array.isArray(results));
    results.forEach((result) => assert(ipRegex({exact: true}).test(result)));
  });

  it('should return array of local ip address that exclude ipv6 address, if argument "options.ipv6" is false.', () => {
    const results = getLocalIps({ipv6: false});

    assert(results);
    assert(Array.isArray(results));
    results.forEach((result) => assert(ipRegex({exact: true}).test(result)));
    results.forEach((result) => assert(ipRegex.v4({exact: true}).test(result)));
  });

});
