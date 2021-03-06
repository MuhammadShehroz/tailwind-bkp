import Component from '@ember/component';

import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNames: ['transactor-info'],

  portal: service(),

  isPortal: readOnly('portal.isActive')
});
