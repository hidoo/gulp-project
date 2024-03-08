import assert from 'node:assert';
import * as importers from '../src/importers.js';

describe('importers', () => {
  describe('compatMagicImporter', () => {
    it('should be accessible to compatMagicImporter as named export.', async () => {
      assert.equal(
        (await import('../src/importers.js')).compatMagicImporter,
        importers.compatMagicImporter
      );
    });

    it('should return an importer as sass.Importer.', () => {
      const actual = importers.compatMagicImporter({}, {});

      assert.equal(typeof actual, 'object');
      assert.equal(typeof actual.canonicalize, 'function');
      assert.equal(typeof actual.load, 'function');
    });
  });

  describe('compatSassImporter', () => {
    it('should be accessible to compatSassImporter as named export.', async () => {
      assert.equal(
        (await import('../src/importers.js')).compatSassImporter,
        importers.compatSassImporter
      );
    });

    it('should return an importer as sass.Importer.', () => {
      const actual = importers.compatSassImporter({}, {});

      assert.equal(typeof actual, 'object');
      assert.equal(typeof actual.findFileUrl, 'function');
    });
  });
});
