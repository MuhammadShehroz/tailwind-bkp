import Model, { attr } from '@ember-data/model';
import { computed } from '@ember/object';
import { gt } from '@ember/object/computed';

export default Model.extend({
  body: attr(),
  by: attr(),
  generatedAt: attr('date'),
  kindKey: attr(),
  recipients: attr('raw'),
  title: attr(),

  class: computed('kindKey', function () {
    let kind = this.kindKey.replace(/_/g, '-');

    return `${kind}-event`;
  }),

  hasRecipients: gt('recipients.length', 0),
  recipientsNames: computed('hasRecipients', 'recipients', function () {
    if (this.hasRecipients) {
      return this.recipients.map((recipient) => recipient.name).join(', ');
    }

    return '';
  })
});
