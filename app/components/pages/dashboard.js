import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { notEmpty } from '@ember/object/computed';

export default Component.extend({
  organization: service(),
  hasDocuments: notEmpty('organization.current.invoiceCreatedAt').readOnly()
});
