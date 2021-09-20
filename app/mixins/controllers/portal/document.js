import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import Comments from 'frontend/mixins/comments';

export default Mixin.create(Comments, {
  queryParams: ['token'],
  download: service(),
  token: null,

  historyEvent: service(),
  historyEvents: computed('model', function () {
    return this.historyEvent.query(this.model);
  }),

  reloadEvents() {
    this.notifyPropertyChange('historyEvents');
  },

  actions: {
    print() {
      let iframe = document.querySelector('#print-iframe');

      if (iframe) iframe.parentNode.removeChild(iframe);

      document.querySelector('body').appendChild(
        (() => {
          let elem = document.createElement('iframe');
          elem.id = 'print-iframe';
          return elem;
        })()
      );

      iframe = document.querySelector('#print-iframe');

      let doc =
        iframe.contentWindow ||
        iframe.contentDocument.document ||
        iframe.contentDocument;

      this.model.previewDoc({ media: 'print', isPortal: true }).then((resp) => {
        iframe.addEventListener('load', () => {
          iframe.focus();
          iframe.contentWindow.print();
        });

        doc.document.open();
        doc.document.write(resp);
        doc.document.close();
      });
    },

    download() {
      let document = this.model;

      this.download.open(document.get('id'), document.modelName);
    },

    reloadEvents() {
      this.reloadEvents();
    }
  }
});
