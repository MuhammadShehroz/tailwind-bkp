import Component from '@ember/component';

export default Component.extend({
  classNames: ['relative'],
  classNameBindings: ['expanded:expanded:collapsed'],
  expanded: false,

  show() {
    this.set('expanded', true);
  },

  hide() {
    this.set('expanded', false);
  },

  setState() {
    if (this.setOpenState) {
      this.setOpenState();
    }
  },

  toggle() {
    if (this.expanded) {
      this.hide();
    } else {
      this.show();
      this.setState();
    }
  },

  actions: {
    toggle() {
      this.toggle();
    },

    hide() {
      this.hide();
    },

    clickOutside(e) {
      if (!this.expanded) {
        return;
      }

      if (this.action) {
        this.action(e);
      }

      this.hide();
    }
  }
});
