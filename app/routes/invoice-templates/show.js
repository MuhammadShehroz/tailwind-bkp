import AuthenticatedRoute from 'frontend/routes/authenticated-route';
import DocumentsShowRoute from 'frontend/mixins/routes/documents/show';
import FormOptions from 'frontend/mixins/routes/form-options';

export default AuthenticatedRoute.extend(DocumentsShowRoute, FormOptions, {
  titleToken: 'View Recurring Invoice Template',
  modelName: 'invoice_template',

  async setupController(controller, model) {
    this._super(controller, model);
    controller.set(
      'currencies',
      controller.currencies || (await this.fetchCurrencies())
    );
  }
});
