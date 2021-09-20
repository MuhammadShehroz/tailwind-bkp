'use strict';

module.exports = {
  extends: 'stylelint-config-sass-guidelines',
  ignoreFiles: ['app/styles/_meyer-reset.scss'],
  rules: {
    'function-url-quotes': 'never',
    'max-nesting-depth': 5,
    'scss/selector-no-redundant-nesting-selector': null,
    'selector-max-compound-selectors': null,
    'selector-max-id': 1,
    'selector-no-qualifying-type': null
  }
};
