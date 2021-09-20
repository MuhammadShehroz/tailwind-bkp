import Component from '@ember/component';

export default Component.extend({
  classNames: [
    'ember-power-select-option',
    'ember-power-select-trigger-option'
  ],

  click() {
    this.action();
  }
});
