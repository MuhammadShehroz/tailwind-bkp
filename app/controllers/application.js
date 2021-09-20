import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { alias, notEmpty } from '@ember/object/computed';

export default Controller.extend({
  session: service(),

  layoutName: null,
  hasLayout: notEmpty('layoutName'),
  isAuthenticated: alias('session.isAuthenticated')
});
