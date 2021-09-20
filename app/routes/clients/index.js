import AuthenticatedRoute from 'frontend/routes/authenticated-route';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { htmlSafe } from '@ember/string';

export default AuthenticatedRoute.extend({
  modals: service(),
  loader: service(),
  titleToken: 'Clients',

  queryParams: {
    name: {
      refreshModel: true
    },

    archived: {
      refreshModel: true
    },

    sort: {
      refreshModel: true
    },

    order: {
      refreshModel: true
    },

    page: {
      refreshModel: true
    }
  },

  model(params) {
    return this.store.query('client', this.mergePagination(params));
  },

  archive: task(function* (client) {
    this.loader.startLoading();
    yield client
      .archive()
      .then(
        () => {
          this.flashMessages.add({
            type: 'success',
            title: 'Client successfully archived.',
            message: `"${client.name}" archived.`,
            timeout: this.defaultTimeout
          });
          this.refresh();
        },
        (error) =>
          this.flashMessages.add({
            type: 'error',
            title: error.name,
            message: htmlSafe(error.message),
            timeout: this.defaultTimeout
          })
      )
      .finally(() => this.loader.endLoading());
  }).drop(),

  unarchive: task(function* (client) {
    this.loader.startLoading();
    yield client
      .unarchive()
      .then(
        () => {
          this.flashMessages.add({
            type: 'success',
            title: 'Client successfully unarchived.',
            message: `"${client.name}" unarchived.`,
            timeout: this.defaultTimeout
          });
          this.refresh();
        },
        (error) =>
          this.flashMessages.add({
            type: 'error',
            title: error.name,
            message: htmlSafe(error.message),
            timeout: this.defaultTimeout
          })
      )
      .finally(() => this.loader.endLoading());
  }).drop(),

  actions: {
    archiveClient(client) {
      this.modals.open('confirm-modal', {
        controller: 'modals.confirm-modal',
        model: client,
        headerTitle: 'Archive Client',
        title: 'Are you sure you want to archive this client?',
        message:
          'All of its data will be hidden, but not deleted. You can unarchive a client at any time.',

        confirmButtonLabel: 'Yes, archive this client',
        confirm: () => this.archive.perform(client)
      });
    },

    unarchiveClient(client) {
      this.modals.open('confirm-modal', {
        controller: 'modals.confirm-modal',
        model: client,
        headerTitle: 'Unarchive Client',
        title: 'Are you sure you want to unarchive this client?',
        message: 'All of its data will be restored.',

        confirmButtonLabel: 'Yes, unarchive this client',
        confirm: () => this.unarchive.perform(client)
      });
    }
  }
});
