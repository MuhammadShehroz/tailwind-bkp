import Mixin from '@ember/object/mixin';
import ValidateAndSave from 'frontend/mixins/validate-and-save';

export default Mixin.create(ValidateAndSave, {
  actions: {
    save() {
      this.set('validationsEnabled', true);
      this.validateAndSaveModel();
    },

    cancel() {
      this.cancel();
    }
  }
});
