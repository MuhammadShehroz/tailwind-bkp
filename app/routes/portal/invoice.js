import Route from '@ember/routing/route';
import DocumentRoute from 'frontend/mixins/routes/portal/document';

export default Route.extend(DocumentRoute, {
  modelName: 'invoice',

  newComment() {
    return this.store.createRecord('comment');
  },

  async setupController(controller, model) {
    this._super(controller, model);
    controller.set('newComment', this.newComment);
  }
});
