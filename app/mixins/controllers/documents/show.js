import Mixin from '@ember/object/mixin';
import { capitalize } from '@ember/string';
import { pluralize } from 'ember-inflector';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';
import { A } from '@ember/array';

export default Mixin.create({
  modals: service(),
  download: service(),
  clients: service(),

  client: readOnly('model.client'),

  currency: computed('model.currency', 'currencies', function () {
    let currencies = this.currencies || A();
    return currencies.findBy('code', this.model.currency);
  }),

  currencySymbol: computed('currencies.[]', 'model.currency', function () {
    return this.currencies?.findBy('code', this.model.currency)?.symbol;
  }),

  showSendIfClientEmails(client, kind, pc) {
    this.clients.contacts(client.get('id')).then((contacts) => {
      if (contacts.length === 0) {
        this.flashMessages.add({
          type: 'error',
          componentName: 'flash-messages/add-contact',
          content: { client, documentId: this.model.get('id') }
        });
      } else {
        this.send('showPanel', kind, pc);
      }
    });
  },

  historyEvent: service(),
  historyEvents: computed('model', function () {
    return this.historyEvent.query(this.model);
  }),

  reloadEvents() {
    this.notifyPropertyChange('historyEvents');
  },

  makeDocumentOpen() {
    this.model.makeOpen().then(() => {
      this.flashMessages.success(
        `${capitalize(this.model.modelName)} status changed to Open.`
      );
    });
  },

  flashMessageTitle(kind) {
    switch (kind) {
      case 'thank_you':
        return 'Thank you note sent.';
      default:
        return `${capitalize(this.model.modelName)} sent.`;
    }
  },

  actions: {
    showPanel(name, pc) {
      if (pc) {
        pc.hide();
      }

      this.hideActions();
      this.set(`show${capitalize(name)}`, true);
    },

    showSendPanel(kind, pc) {
      this.client.then((client) => {
        if (client.hasEmail) {
          this.send('showPanel', kind, pc);
        } else {
          this.showSendIfClientEmails(client, kind, pc);
        }
      });
    },

    send(delivery, kind) {
      delivery.save().then(() => {
        this.flashMessages.success(this.flashMessageTitle(kind));
        delivery.unloadRecord();
        this.model.reload();
        this.reloadEvents();
      });
      this.hideActions();
    },

    hideActions() {
      this.hideActions();
    },

    makeOpen() {
      this.modals.open('confirm-modal', {
        controller: 'modals.confirm-modal',
        headerTitle: 'Delete Event',
        title: `Are you sure you want to change this ${this.model.modelName}'s status to Open?`,
        confirmButtonLabel: 'Change status',
        cancelButtonLabel: 'Cancel',
        confirm: () => this.makeDocumentOpen()
      });
    },

    destroy() {
      let { modelLabel } = this.model;

      this.modals.open('confirm-modal', {
        controller: 'modals.confirm-modal',
        headerTitle: `Delete ${capitalize(modelLabel)}`,
        title: `Are you sure you want to delete this ${modelLabel}?`,
        confirmButtonLabel: `Delete ${modelLabel}`,
        cancelButtonLabel: `Keep ${modelLabel}`,
        isConfirmButtonStyleDanger: true,
        confirm: () => {
          this.model.destroyRecord().then(() => {
            this.flashMessages.success(`"${this.model.identifier}" deleted.`);
            this.transitionToRoute(`${pluralize(this.model.modelName)}.index`);
          });
        }
      });
    },

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

      this.model.previewDoc({ media: 'print' }).then((resp) => {
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
      this.download.open(this.model.id, this.model.modelName);
    },

    duplicate() {
      let queryParams = {
        // eslint-disable-next-line camelcase
        source_type: this.model.modelName,
        // eslint-disable-next-line camelcase
        source_id: this.model.id
      };
      this.transitionToRoute(`${pluralize(this.model.modelName)}.new`, {
        queryParams
      });
    },

    reloadEvents() {
      this.reloadEvents();
    }
  }
});
