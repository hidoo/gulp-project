import magicImporter from 'node-sass-magic-importer';

export { createFileImporter } from '@hidoo/sass-importer';

/**
 * compatible version of node-sass-magic-importer
 *
 * @param {import('sass').Options} sassOptions sass options
 * @param {Object} options importer options
 * @return {import('sass').Importer<sync>}
 */
export function compatMagicImporter(sassOptions = {}, options = {}) {
  return {
    canonicalize(url, { containingUrl: prevUrl }) {
      prevUrl.searchParams.set('url', decodeURIComponent(url));

      return prevUrl;
    },
    load(prevUrl) {
      const url = prevUrl.searchParams.get('url');
      const prev = prevUrl.pathname;
      const mockSassInstance = {
        options: {
          includePaths: '',
          ...sassOptions
        }
      };

      const importer = magicImporter(options);

      // Emulate the context so that
      // it is be called as a method of sass instance.
      // See: https://github.com/maoberlehner/node-sass-magic-importer/blob/61a2e93027d162b988e0e0554b3b8d9268e6163e/packages/node-sass-magic-importer/src/index.ts#L59
      const result = importer.apply(mockSassInstance, [url, prev]);

      if (result && result.contents) {
        return {
          contents: result.contents,
          syntax: 'scss'
        };
      }
      return null;
    }
  };
}
