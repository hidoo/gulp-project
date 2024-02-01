import {ESLint} from 'eslint';

const indentSize = 2;
const baseConfig = {
  'extends': [
    'eslint:recommended'
  ],
  'env': {
    node: true,
    es2024: true
  },
  'parserOptions': {
    sourceType: 'module',
    ecmaVersion: 'latest'
  },
  'plugins': [
    '@stylistic/js'
  ],
  'rules': {
    '@stylistic/js/comma-dangle': [
      'error',
      {
        arrays: 'never',
        objects: 'never',
        imports: 'never',
        exports: 'never',
        functions: 'never'
      }
    ],
    '@stylistic/js/eol-last': [
      'error',
      'always'
    ],
    '@stylistic/js/indent': [
      'error',
      indentSize,
      {
        VariableDeclarator: {
          'var': 2,
          'let': 2,
          'const': 3
        },
        SwitchCase: 1
      }
    ],
    '@stylistic/js/padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: ['const', 'let', 'var'],
        next: '*'
      },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var']
      }
    ],
    '@stylistic/js/no-multiple-empty-lines': [
      'error',
      {
        max: 1,
        maxBOF: 0,
        maxEOF: 1
      }
    ],
    '@stylistic/js/no-trailing-spaces': 'error'
  }
};

/**
 * return formatted javascript code by eslint
 *
 * @param {String} src javascript raw code
 * @param {Object} overrideConfig override config
 * @return {Promise}
 */
export async function formatJS(src = '', overrideConfig = {}) {
  if (typeof src !== 'string') {
    throw new TypeError('Argument "src" is not string.');
  }

  const eslint = new ESLint({
    useEslintrc: false,
    ignore: false,
    fix: true,
    baseConfig,
    overrideConfig
  });
  const [result] = await eslint.lintText(src);

  return result.output || src;
}

/**
 * return formatted json code
 *
 * @param {String} src json raw code
 * @return {Promise}
 */
export function formatJSON(src = '') {
  let json = src;

  if (typeof src === 'string') {
    json = JSON.parse(src);
  }

  return `${JSON.stringify(json, null, indentSize)}\n`;
}
