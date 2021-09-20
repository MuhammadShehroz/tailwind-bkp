import AuthenticatedRoute from 'frontend/routes/authenticated-route';

export default class EstimatePreviewRoute extends AuthenticatedRoute {
  layout = 'app';

  model({ id }) {
    return this.store.find('estimate', id);
  }

  createLogo() {
    return this.store.createRecord('logo');
  }

  removeLogo(id) {
    let adapter = this.store.adapterFor('organization');
    return adapter.destroyAccountLogo(id);
  }

  setupController(controller, model, transition) {
    super.setupController(controller, model);
    controller.logo = this.createLogo();
    controller.removeLogo = (id) => this.removeLogo(id);
    if (transition.from?.name === 'estimates.new')
      controller.backRoute = 'estimates.edit';
    else
      controller.backRoute = ['estimates.show', 'estimates.edit'].includes(
        transition.from?.name
      )
        ? transition.from?.name
        : 'estimates.show';
  }

  deactivate() {
    // eslint-disable-next-line ember/no-controller-access-in-routes
    this.controller.logo.rollbackAttributes();
  }
}
