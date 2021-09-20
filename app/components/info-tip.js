import Component from '@ember/component';

export default Component.extend({
  classNames: ['tooltip', 'infotip'],
  isOpen: false,

  didInsertElement() {
    this._super(...arguments);
    this.handleMouseEnter = () => this.set('isOpen', true);
    this.handleMouseLeave = () => this.set('isOpen', false);
    this.element.addEventListener('mouseenter', this.handleMouseEnter);
    this.element.addEventListener('mouseleave', this.handleMouseLeave);
  },

  willDestroyElement() {
    this._super(...arguments);
    this.element.removeEventListener('mouseenter', this.handleMouseEnter);
    this.element.removeEventListener('mouseleave', this.handleMouseLeave);
  },

  click() {
    this.toggleProperty('isOpen');
  }
});
