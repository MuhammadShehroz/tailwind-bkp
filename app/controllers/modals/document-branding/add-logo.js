// import Controller from '@ember/controller';
// import ModalController from 'frontend/mixins/controllers/modal';
// import { inject as service } from '@ember/service';
// import { readOnly } from '@ember/object/computed';
// import { task } from 'ember-concurrency';
// import InvalidError from 'frontend/utils/errors/invalid-error';
// import { htmlSafe } from '@ember/string';

// export default Controller.extend(ModalController, {
//   store: service(),
//   loader: service(),
//   organization: service(),
//   currentOrg: readOnly('organization.current'),
//   selectedFile: null,

//   close() {
//     this.selectedFile = null;
//     this._super(...arguments);
//   },

//   _saveLogoTask: task(function* () {
//     if (!this.selectedFile) return;
//     this.loader.startLoading();
//     let avatar = this.store.createRecord('logo', { file: this.selectedFile });
//     let org = yield this.currentOrg;
//     avatar
//       .save()
//       .then(
//         () => {
//           org.reload();
//           this.model.onSave(avatar);
//           this.close();
//           this.flashMessages.add({
//             type: 'success',
//             title: 'Successfully saved',
//             message: 'Logo successfully saved',
//             timeout: this.defaultTimeout
//           });
//         },
//         (error) => {
//           throw new InvalidError(error);
//         }
//       )
//       .catch((error) => {
//         this.flashMessages.add({
//           type: 'error',
//           title: error.name,
//           message: htmlSafe(error.message),
//           timeout: this.defaultTimeout
//         });
//       })
//       .finally(() => this.loader.endLoading());
//   }).drop(),

//   actions: {
//     cancel() {
//       return () => this.close();
//     }
//   }
// });

import Controller from '@ember/controller';
import ModalController from 'frontend/mixins/controllers/modal';

export default Controller.extend(ModalController, {
  actions: {
    onSave() {
      this.onSave();
    }
  }
});
