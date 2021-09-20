import ApplicationAdapter from './application';
import { pluralize } from 'ember-inflector';
import { dasherize } from '@ember/string';

export default ApplicationAdapter.extend({
  pathForType(type) {
    let path = pluralize(dasherize(type));
    return `${this.session.get('data.organizationId')}/${path}`;
  },

  previewMessage(modelName, data) {
    let url = `${this.buildURL(modelName)}/preview`;
    return this.ajax(url, 'GET', { data }).catch((error) =>
      Promise.reject(error)
    );
  }
});
