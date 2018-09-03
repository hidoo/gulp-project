/**
 * return options for rollup-plugin-license
 * @return {Object}
 */
export default function licenseOptions() {
  return {
    /* eslint-disable max-len */
    banner: '' +
      '@license\n' +
      '\n' +
      '<%= pkg.title || pkg.name %>:\n' +
      '<% if (pkg.author) { %>' +
      '  author: <%= pkg.author %>\n' +
      '<% } %>' +
      '<% if (pkg.version) { %>' +
      '  version: <%= pkg.version %>\n' +
      '<% } %>' +
      '<% dependencies.forEach((dependency) => { %>\n' +
      '<%= dependency.name %>:\n' +
      '<% if (dependency.license) { %>' +
      '  license: <%= dependency.license %>\n' +
      '<% } %>' +
      '<% if (dependency.author && dependency.author.name) { %>' +
        '  author: <%= dependency.author.name %><% if (dependency.author.email) { %> <<%= dependency.author.email %>><% } %>\n' +
      '<% } %>' +
      '<% if (dependency.version) { %>' +
      '  version: <%= dependency.version %>\n' +
      '<% } %>' +
      '<% }) %>'
    /* eslint-enable max-len */
  };
}
