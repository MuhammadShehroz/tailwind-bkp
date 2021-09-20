module.exports = {
  root: true,

  env: {
    browser: true,
    node: true
  },

  parser: 'babel-eslint',

  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },

  plugins: ['ember', 'ember-suave', 'prettier'],

  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'plugin:ember-suave/recommended',
    'prettier'
  ],

  rules: {
    // Formatting
    'prettier/prettier': 'error',

    // ES6
    'arrow-parens': ['error', 'always'],
    'no-undef': 'error',
    'no-var': 'error',
    'object-shorthand': ['error', 'always'],
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'no-console': 'error',

    // Overrides for Ember
    'new-cap': ['error', { capIsNewExceptions: ['A'] }],
    // Overrides for Suave
    'ember-suave/no-direct-property-access': ['error', ['Ember']],

    // ideally we will enforce these
    'ember/no-mixins': 'off',
    'ember/no-new-mixins': 'off',
    'ember/no-side-effects': 'off',
    'ember/no-classic-classes': 'off',
    'ember/no-actions-hash': 'off',
    'ember/no-computed-properties-in-native-classes': 'off',
    'ember/require-tagless-components': 'off',
    'ember/no-classic-components': 'off',
    'ember/require-super-in-lifecycle-hooks': 'off',
    'ember/no-component-lifecycle-hooks': 'off',
    'ember/no-empty-glimmer-component-classes': 'off'
  },

  globals: {
    zE: 'readonly'
  }
};
