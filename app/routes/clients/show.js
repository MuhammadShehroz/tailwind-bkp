import AuthenticatedRoute from 'frontend/routes/authenticated-route';
import { inject as service } from '@ember/service';

export default AuthenticatedRoute.extend({
  clients: service(),

  titleToken(model) {
    return model.name;
  },

  setupController(controller, model) {
    this._super(...arguments);
    controller.set('contacts', this.clients.contacts(model.id));
    controller.set('clientStats', this.clients.stats(model.id));
  }
});
