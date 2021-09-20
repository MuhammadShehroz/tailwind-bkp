import NewEdit from './new-edit';

export default NewEdit.extend({
  successMessage: 'Client created.',

  transitionOnCancel() {
    this.transitionToRoute('clients');
  }
});
