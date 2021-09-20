import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'frontend/routes/authenticated-route';

export default AuthenticatedRoute.extend({
  titleToken: 'Templates',
  organization: service(),

  model() {
    return this.organization.current;
  },

  preview(modelName, data) {
    let adapter = this.store.adapterFor(modelName);
    return adapter.previewMessage(modelName, data);
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('preview', this.preview);
  }
});
