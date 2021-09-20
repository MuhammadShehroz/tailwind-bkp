import Model, { attr, belongsTo } from '@ember-data/model';
import ENV from 'frontend/config/environment';
import { computed } from '@ember/object';

export default Model.extend({
  options: attr('raw'),
  type: attr(),
  path: attr(),
  status: attr(),

  organization: belongsTo(),

  url: computed('path', function () {
    let { path } = this;
    if (path) {
      return ENV.APP.apiHost + this.path;
    } else {
      return null;
    }
  })
});
