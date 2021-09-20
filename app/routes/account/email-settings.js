import AuthenticatedRoute from 'frontend/routes/authenticated-route';

export default AuthenticatedRoute.extend({
  modelName: 'custom-email-domain',
  titleToken: 'Email Settings',

  model() {
    return this.store.queryRecord(this.modelName, { me: true });
  },

  createDomain() {
    return this.store.createRecord(this.modelName);
  },

  sendTestEmail(model) {
    let adapter = this.store.adapterFor(this.modelName);
    return adapter.sendTestEmail(model);
  },

  verifyEmail(model) {
    let adapter = this.store.adapterFor(this.modelName);
    return adapter.verify(model);
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.setProperties({
      refresh: () => this.refresh(),
      customDomain: this.createDomain(),
      sendTestEmail: (model) => this.sendTestEmail(model),
      verifyEmail: (model) => this.verifyEmail(model)
    });
  }
});
