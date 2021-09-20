import Mixin from '@ember/object/mixin';
import DocumentsController from 'frontend/mixins/controllers/documents/index';
import { computed } from '@ember/object';

export default Mixin.create(DocumentsController, {
  defaultParams: computed(function () {
    let defaultParams = this._super();
    defaultParams.status.pushObject('past_due');
    return defaultParams;
  })
});
