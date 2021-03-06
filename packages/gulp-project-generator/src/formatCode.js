import eslint from 'eslint';
import parser from 'babel-eslint';

const defaultRules = {
  'comma-dangle': ['error', {
    arrays: 'never',
    objects: 'never',
    imports: 'never',
    exports: 'never',
    functions: 'never'
  }],
  'eol-last': ['error', 'always'],
  // eslint-disable-next-line no-magic-numbers
  'indent': ['error', 2, {
    VariableDeclarator: {
      'var': 2,
      'let': 2,
      'const': 3
    },
    SwitchCase: 1
  }],
  'newline-after-var': ['error', 'always'],
  'no-multiple-empty-lines': ['error', {
    max: 1,
    maxBOF: 0,
    maxEOF: 1
  }],
  'no-trailing-spaces': 'error'
};

/**
 * return fixed code format by eslint
 *
 * @param {String} src javascript raw code
 * @param {Object} rules additional rules of eslint
 * @return {Promise}
 */
export default function formatCode(src = '', rules = {}) {
  if (typeof src !== 'string') {
    throw new TypeError('Argument "src" is not string.');
  }

  const linter = new eslint.Linter();

  linter.defineParser('babel-eslint', parser);

  return new Promise((resolve) => {
    const results = linter.verifyAndFix(src, {
      'extends': 'eslint:recommended',
      'parser': 'babel-eslint',
      'rules': {...defaultRules, ...rules}
    });

    resolve(results.output);
  });
}
