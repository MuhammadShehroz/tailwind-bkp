import Component from '@ember/component';

export default Component.extend({
  actions: {
    undo() {
      this.componentAction();
      this.close();
    }
  }
});
