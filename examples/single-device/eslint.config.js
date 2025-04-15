import configs from '@hidoo/eslint-config';
import prettierConfig from '@hidoo/eslint-config/+prettier';
import nodeConfig from '@hidoo/eslint-config/+node';
import mochaConfig from '@hidoo/eslint-config/+mocha';

export default [
  ...configs,
  prettierConfig,
  {
    files: [
      'src/server/**/*.js',
      'task/**/*.js',
      '**/*.spec.js',
      '**/*.test.js',
      'config.js',
      'gulpfile.js'
    ],
    ...nodeConfig,
    rules: {
      ...nodeConfig.rules,
      'n/file-extension-in-import': ['error', 'always']
    }
  },

  // for test files
  {
    files: ['**/*.spec.js', '**/*.test.js'],
    ...mochaConfig
  },

  // for source files
  {
    files: ['src/js/**/*.js'],
    languageOptions: {
      globals: {
        module: true,
        require: true,
        process: true
      }
    }
  },

  // for this file
  {
    files: ['eslint.config.js'],
    rules: {
      'import/no-anonymous-default-export': 'off'
    }
  },

  // ignore files
  {
    ignores: ['node_modules/*', 'public/*']
  }
];
