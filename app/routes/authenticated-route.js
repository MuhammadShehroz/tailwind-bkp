import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { isEqual, isBlank, typeOf } from '@ember/utils';
import { assign } from '@ember/polyfills';
import { inject as service } from '@ember/service';

const arraySeparator = ',';
const array = 'array';

export default Route.extend(AuthenticatedRouteMixin, {
  user: service(),
  organization: service(),

  layout: 'app',

  buildRouteInfoMetadata() {
    return {
      label:
        typeof this.titleToken === 'function'
          ? // eslint-disable-next-line ember/no-controller-access-in-routes
            this.titleToken(this.controller.model)
          : this.titleToken
    };
  },

  async activate() {
    let org = await this.organization._current;
    let { isTrial, hasPaymentMethod, remainingDays, status } =
      await org.subscription;
    let trialExpired =
      isEqual(status, 'trialing') && isEqual(remainingDays < 0, true);

    if (
      isTrial &&
      isEqual(hasPaymentMethod, false) &&
      isEqual(trialExpired, false)
    ) {
      this.flashMessages.clearMessages();
      this.flashMessages.add({
        type: remainingDays < 3 ? 'error' : 'warning',
        title: 'Warning',
        message: `Your free trial ends ${this.remainingTrialDays(
          remainingDays
        )}.`,

        componentName: 'flash-messages/undo-button',
        componentContent: 'Upgrade now',
        componentAction: () => this.transitionTo('account.subscription'),
        sticky: true
      });
    }
  },

  remainingTrialDays(remainingDays) {
    if (remainingDays === 0) return 'today';
    if (remainingDays === 1) return 'tomorrow';
    if (remainingDays > 1) return `in ${remainingDays} days`;
    return '';
  },

  beforeModel() {
    this._super(...arguments);
    return this._loadUserAndOrganization();
  },

  serializeQueryParam(value, urlKey, defaultValueType) {
    if (defaultValueType === array) {
      return value.join(arraySeparator);
    } else {
      return this._super(...arguments);
    }
  },

  deserializeQueryParam(value, urlKey, defaultValueType) {
    if (defaultValueType === array) {
      return value.split(arraySeparator).reject((v) => isBlank(v));
    } else {
      return this._super(...arguments);
    }
  },

  mergePagination(params) {
    let pageNumber = Number(params.page);
    if (pageNumber && typeOf(pageNumber) === 'number') {
      return assign(params, { page: { number: params.page } });
    }

    return params;
  },

  _loadUserAndOrganization() {
    return this.user.current
      .then(() => this.organization.load())
      .catch(() => this.session.invalidate());
  },

  actions: {
    loading() {
      return true;
    }
  }
});
