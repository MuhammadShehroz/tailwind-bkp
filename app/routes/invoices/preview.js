import AuthenticatedRoute from 'frontend/routes/authenticated-route';
import { next } from '@ember/runloop';
export default class InvoicePreviewRoute extends AuthenticatedRoute {
  layout = 'app';

  model({ id }) {
    return this.store.find('invoice', id);
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
    if (transition.from?.name === 'invoices.new')
      controller.backRoute = 'invoices.edit';
    else
      controller.backRoute = ['invoices.show', 'invoices.edit'].includes(
        transition.from?.name
      )
        ? transition.from?.name
        : 'invoices.show';

    let kind = transition.to?.queryParams?.kind;
    if (kind && !['send', 'reminder', 'thank_you'].includes(kind)) {
      // This is a workaround as the original issue has not been solved.
      // You can read about it here https://github.com/emberjs/ember.js/issues/5465
      next(() => controller.set('kind', null));
    }
  }

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.set('kind', null);
    }
  }

  deactivate() {
    // eslint-disable-next-line ember/no-controller-access-in-routes
    this.controller.logo.rollbackAttributes();
  }
}
