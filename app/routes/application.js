import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import { inject as service } from '@ember/service';
import { parseResponseStatusCode } from 'frontend/mixins/parse-response-status-code';
import LoaderMixin from 'frontend/mixins/loader';

export default Route.extend(ApplicationRouteMixin, LoaderMixin, {
  metrics: service(),
  modals: service(),
  router: service(),
  session: service(),

  init() {
    this._super(...arguments);

    let { modals } = this;
    window.onhashchange = () => {
      let currentUrl = window.location.href;
      if (modals.modalIsOpen && currentUrl[currentUrl.length - 1] !== '#') {
        modals.close();
      }
    };

    modals.on('open', (...args) => this.openModal(...args));
    modals.on('close', (...args) => this.closeModal(...args));

    let { router } = this;

    router.on('routeDidChange', () => {
      let page = router.currentURL;
      let title = router.currentRouteName || 'unknown';

      this.metrics.trackPage({
        page: page.split('?')[0],
        url: window.location.href.split('?')[0],
        title
      });
    });
  },

  title(tokens) {
    return tokens.concat('Blinksale').join(' | ');
  },

  openModal(modal) {
    let { template, into, model, outlet, params } = modal;
    let options = { into, model, outlet };
    if (params.controller) {
      // eslint-disable-next-line ember/no-controller-access-in-routes
      let controller = this.controllerFor(params.controller);
      controller.setProperties(params);
    }

    this.render(template, options);
    document.querySelector('body').classList.add('modal-in');
  },

  closeModal() {
    this.disconnectOutlet({ outlet: 'modal', parentView: 'application' });
    document.querySelector('body').classList.remove('modal-in');
  },

  sessionInvalidated() {
    let { impersonateURL } = this.session;

    if (impersonateURL) {
      delete this.session.impersonateURL;
      window.location.replace(impersonateURL);
    } else {
      this._super();
    }
  },

  actions: {
    error(response) {
      switch (parseResponseStatusCode(response)) {
        case '403':
          this.flashMessages.warning(
            'Administration can only be done by the primary account holder'
          );
          return false;
        case '402':
          this.intermediateTransitionTo('error-payment-required');
          return false;
        case '404':
          this.intermediateTransitionTo('error-404', 404);
          return false;
        case '500':
          this.intermediateTransitionTo('error-500');
          return false;
        default:
          return true;
      }
    }
  }
});
