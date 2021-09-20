import Mixin from '@ember/object/mixin';
import { memberAction } from 'frontend/lib/restless-methods';
import { computed } from '@ember/object';
import { PromiseObject } from '@ember-data/store/-private';

export default Mixin.create({
  previewHtml: computed('isNew', function () {
    let action = this.isNew ? 'build_and_preview' : 'preview';

    return memberAction(action, {
      method: 'post',
      ajaxOptions: { dataType: 'html' },
      updateStore: false
    });
  }),

  portalPreviewHtml: computed(function () {
    return memberAction('preview', {
      method: 'get',
      ajaxOptions: { dataType: 'html' },
      updateStore: false
    });
  }),

  previewDoc(options) {
    let params = {
      ...this.serialize(),
      ...options
    };

    let preview;
    if (options.isPortal) {
      preview = this.portalPreviewHtml(params);
    } else {
      preview = this.previewHtml(params);
    }

    return PromiseObject.create({
      promise: preview
    });
  }
});
