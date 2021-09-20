import Component from '@ember/component';

export default Component.extend({
  tagName: 'button',
  attributeBindings: ['type'],
  type: 'button',
  isTrailingButton: false,
  classNames: ['tw-button'],
  classNameBindings: ['isTrailingButton:trailing-button'],

  click() {
    this.onButtonClick();
  }
});
