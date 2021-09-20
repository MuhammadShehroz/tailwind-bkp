import TaxForm from 'frontend/components/tax-form';

export default TaxForm.extend({
  saveChain() {
    return this.model.save().then(() => {
      this.flashMessages.add({
        type: 'success',
        title: this.successTitle,
        message: this.successMessage,
        timeout: this.defaultTimeout
      });
      this.close();
    });
  },

  actions: {
    cancel() {
      this._super();
      this.close();
    }
  }
});
