import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  undo: readOnly('content.undo'),
  message: readOnly('content.message'),

  actions: {
    undo() {
      this.close();
      this.undo();
    }
  }
});
