import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import { pluralize } from 'ember-inflector';

export default Mixin.create({
  tagName: 'div',
  classNames: ['documents', 'list'],
  router: service(),

  actions: {
    showDocument(document) {
      this.router.transitionTo(
        `${pluralize(document.modelName)}.show`,
        document
      );
    }
  }
});
