import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import { readOnly, notEmpty } from '@ember/object/computed';

export default Mixin.create({
  tagName: 'section',
  portal: service(),
  organization: service(),
  documentOrganization: readOnly('organization.current'),
  client: readOnly('model.client'),
  isPortal: readOnly('portal.isActive'),

  hasHistoryEvents: notEmpty('historyEvents')
});
