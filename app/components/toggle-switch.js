import Component from '@ember/component';

export default Component.extend({
  value: false,
  disabled: false,
  classNames: ['tw-switch'],

  onChange: () => {},

  actions: {
    toggle() {
      this.toggleProperty('value');
      this.onChange(this.value);
    }
  }
});
