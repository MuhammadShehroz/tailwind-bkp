import Controller from '@ember/controller';
import EditController from 'frontend/mixins/controllers/documents/edit';
import FormBase from 'frontend/mixins/form-base';

export default Controller.extend(EditController, FormBase, {
  saveChain(options) {
    return this.model.save().then(() => {
      this.model.reload();
      this.transitionToRoute(options.successRedirectTo, this.model);
      this.flashMessages.add({
        type: 'success',
        title: 'Successfully saved.',
        message: `Estimate ${
          this.model.isDraft ? 'saved to drafts' : 'updated'
        }.`,

        timeout: this.defaultTimeout
      });
    });
  },

  actions: {
    async fetchCountries() {
      this.set('countries', this.fetchCountries());
    },

    save() {
      this.save.perform({ successRedirectTo: 'estimates.show' });
    },

    saveAndPreview() {
      this.save.perform({ successRedirectTo: 'estimates.preview' });
    }
  }
});
