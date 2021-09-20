import Model, { attr } from '@ember-data/model';
import ENV from 'frontend/config/environment';
import { computed } from '@ember/object';

export default Model.extend({
  name: attr(),
  options: attr(),
  path: attr(),
  model_id: attr(), // eslint-disable-line camelcase
  model_type: attr(), // eslint-disable-line camelcase
  status: attr(),

  url: computed('path', function () {
    return ENV.APP.apiHost + this.path;
  })
});
