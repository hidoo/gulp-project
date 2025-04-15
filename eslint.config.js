import configs from '@hidoo/eslint-config';
import compatibilityConfig from '@hidoo/eslint-config/+compatibility';
import prettierConfig from '@hidoo/eslint-config/+prettier';
import nodeConfig from '@hidoo/eslint-config/+node';
import mochaConfig from '@hidoo/eslint-config/+mocha';

export default [
  ...configs,
  compatibilityConfig,
  prettierConfig,
  {
    rules: {
      'no-promise-executor-return': 'off',
      'no-underscore-dangle': [
        'error',
        {
          allow: ['__dirname']
        }
      ]
    }
  },

  // for this file
  {
    files: ['eslint.config.js', '**/eslint.config.js'],
    rules: {
      'import/no-anonymous-default-export': 'off'
    }
  },

  // for node files
  {
    files: [
      '**/gulpfile.js',
      '**/config.js',
      '**/task/**/*.js',
      '**/src/server/**/*.js',
      'packages/**/src/**/*.js',
      'scripts/**/*.js'
    ],
    ...nodeConfig,
    rules: {
      ...nodeConfig.rules,
      'jsdoc/no-defaults': 'off',
      'jsdoc/tag-lines': 'off',
      'n/file-extension-in-import': ['error', 'always'],
      'n/no-unpublished-import': 'off'
    }
  },

  // for test files
  {
    files: ['**/*.test.js'],
    ...nodeConfig,
    rules: {
      ...nodeConfig.rules,
      'n/file-extension-in-import': ['error', 'always'],
      'n/no-sync': 'off',
      'n/no-process-env': 'off'
    }
  },
  {
    files: ['**/*.test.js'],
    ...mochaConfig,
    rules: {
      ...mochaConfig.rules,
      'mocha/no-hooks-for-single-case': 'off',
      'mocha/no-setup-in-describe': 'off'
    }
  },

  // for example files
  {
    files: ['**/src/js/**/*.js'],
    languageOptions: {
      globals: {
        module: true,
        require: true,
        process: true
      }
    }
  },

  // for template and fixture files
  {
    files: [
      'packages/**/template/**/*.js',
      'packages/**/test/fixtures/**/*.js'
    ],
    rules: {
      'no-console': 'error',
      'import/no-unresolved': 'off',
      'n/no-process-env': 'off'
    }
  },
  {
    files: ['packages/gulp-task-build-js-*/test/fixtures/**/*.js'],
    languageOptions: {
      globals: {
        module: true,
        require: true,
        process: true
      }
    },
    rules: {
      'n/file-extension-in-import': ['error', 'never']
    }
  },
  {
    files: ['packages/gulp-task-build-styleguide-kss/builder/builder.js'],
    ...nodeConfig,
    languageOptions: {
      ...nodeConfig.languageOptions,
      sourceType: 'commonjs',
      globals: {
        ...nodeConfig.languageOptions.globals,
        module: true,
        require: true
      }
    },
    rules: {
      'n/no-process-env': 'off'
    }
  },

  // ignore files
  {
    ignores: [
      'node_modules/*',
      'packages/**/node_modules/*',
      'packages/**/lib/*',
      'packages/**/test/fixtures/dest/*',
      'packages/**/test/fixtures/expected/*',
      'packages/gulp-project-generator/test/fixtures/src/formatCode/*',
      'packages/gulp-task-build-js-rollup/test/fixtures/src/error.js',
      'examples/**/node_modules/*',
      'examples/**/public/*'
    ]
  }
];
