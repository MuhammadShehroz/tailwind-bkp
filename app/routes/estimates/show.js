import AuthenticatedRoute from 'frontend/routes/authenticated-route';
import DocumentsShowRoute from 'frontend/mixins/routes/documents/show';
import FormOptions from 'frontend/mixins/routes/form-options';

export default AuthenticatedRoute.extend(DocumentsShowRoute, FormOptions, {
  titleToken: 'View Estimate',
  modelName: 'estimate',

  afterModel(model, transition) {
    this.set('showSend', transition.data.showSend);

    return model.get('client');
  },

  newComment() {
    return this.store.createRecord('comment');
  },

  async setupController(controller, model) {
    this._super(controller, model);
    controller.setProperties({
      showSend: this.showSend,
      newComment: this.newComment,
      currencies: controller.currencies || (await this.fetchCurrencies())
    });
  }
});
