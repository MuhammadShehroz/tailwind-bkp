import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  close() {
    this.flash.destroyMessage();
  },

  actions: {
    close() {
      this.close();
    }
  }
});
