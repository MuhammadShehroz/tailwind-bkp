import NewEdit from './new-edit';
import Breadcrumbs from 'frontend/mixins/controllers/breadcrumbs';

export default NewEdit.extend(Breadcrumbs, {
  successMessage: 'Client preferences updated.',

  transitionOnCancel() {
    this.transitionToRoute('clients.show', this.model);
  }
});
