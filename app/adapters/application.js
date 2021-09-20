import ActiveModelAdapter from 'active-model-adapter';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { pluralize } from 'ember-inflector';
import { underscore } from '@ember/string';
import ENV from 'frontend/config/environment';
import {
  NotFoundError,
  ServerError,
  InvalidError,
  errorsHashToArray
} from '@ember-data/adapter/error';

const ORGANIZATION_SCOPED = [
  'client',
  'comment',
  'contact',
  'delivery',
  'download',
  'estimate',
  'export-report',
  'history-event',
  'invitation',
  'invoice-template',
  'invoice',
  'logo',
  'member',
  'notification',
  'organization-membership',
  'amount-stat',
  'payment',
  'paypal-merchant-profile',
  'recurring-schedule',
  'saved-item',
  'stripe-merchant-profile',
  'coinbase-merchant-profile',
  'subscription',
  'tax',
  'unit-of-measurement',
  'custom-email-domain',
  'liquid-message'
];

const PORTAL_ACCESSIBLE = [
  'client',
  'comment',
  'download',
  'estimate',
  'history-event',
  'invoice',
  'payment',
  'stripe-charge',
  'tax',
  'unit-of-measurement',
  'stripe-merchant-profile'
];

const portalIsActive = 'portal.isActive';

export default ActiveModelAdapter.extend(DataAdapterMixin, {
  host: ENV.APP.apiHost,
  organization: service(),
  portal: service(),
  session: service(),

  namespace: computed(portalIsActive, function () {
    if (this.get(portalIsActive)) {
      return 'portal';
    } else {
      return 'api';
    }
  }).readOnly(),

  headers: computed(
    portalIsActive,
    'session.{isAuthenticated,data.authenticated}',
    function () {
      if (this.get(portalIsActive)) {
        let { portal } = this;

        return {
          'Content-Type': 'application/json',
          Authorization: `Token token="${portal.get(
            'token'
          )}", document_id="${portal.get(
            'documentId'
          )}", document_type="${portal.get('documentType')}"`
        };
      } else {
        let { email, token } = this.session.data.authenticated;
        let authData = `Token token="${token}", email="${email}"`;
        return { Authorization: authData };
      }
    }
  ),

  pathForType(type) {
    let path = pluralize(underscore(type));

    if (PORTAL_ACCESSIBLE.includes(type) && this.get(portalIsActive)) {
      return path;
    } else if (ORGANIZATION_SCOPED.includes(type)) {
      return `${this.session.get('data.organizationId')}/${path}`;
    } else {
      return this._super(type);
    }
  },

  findRecord(store, type, id, snapshot) {
    let result = this._super(...arguments);

    if (snapshot.adapterOptions) {
      if (snapshot.adapterOptions.isRestoreMode) {
        let url = this.urlForRestoreRecord(id, type.modelName);
        result = this.ajax(url, 'PATCH');
      }
    }

    return result;
  },

  urlForRestoreRecord(id, modelName) {
    return `${this.buildURL(modelName, id)}/restore`;
  },

  handleResponse(status, headers, payload) {
    if (status === 500) {
      return new ServerError();
    }

    if (status === 404) {
      return new NotFoundError();
    }

    if (status === 422) {
      return new InvalidError(errorsHashToArray(payload.errors));
    }

    return this._super(...arguments);
  }
});
