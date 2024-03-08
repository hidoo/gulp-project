import assert from 'node:assert';
import log from '../src/log.js';

describe('log', () => {
  it('should be accessible to fancy-log by default export.', async () => {
    assert.equal((await import('../src/log.js')).default, log);
    assert.equal((await import('fancy-log')).default, log);
  });
});
