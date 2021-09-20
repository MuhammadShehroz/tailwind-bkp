import Controller from '@ember/controller';
import Breadcrumbs from 'frontend/mixins/controllers/breadcrumbs';

export default Controller.extend(Breadcrumbs, {
  transitionToSuitedRoute(success) {
    let newTransition = this.transitionToRoute(this.done);
    newTransition.data.showSend = success;
  },

  transitionToNextRoute(success) {
    if (this.done) {
      this.transitionToSuitedRoute(success);
      return;
    }

    this.transitionToRoute('clients.show', this.model.client);
  },

  actions: {
    onSave(success) {
      this.transitionToNextRoute(success);
    },

    cancel() {
      this.transitionToNextRoute(false);
    }
  }
});
