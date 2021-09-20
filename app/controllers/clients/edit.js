import NewEdit from './new-edit';

export default NewEdit.extend({
  successMessage: 'Client updated.',
  queryParams: ['done'],
  done: null,

  transitionOnCancel() {
    this.transitionToRoute('clients.show', this.model);
  }
});
