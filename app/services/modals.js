import Service from '@ember/service';
import Evented from '@ember/object/evented';
import EmberObject, { computed } from '@ember/object';

const renderOptions = ['controller', 'into', 'model', 'outlet'];

const Modal = EmberObject.extend({
  into: 'application',
  model: null,
  name: null,
  outlet: 'modal',

  template: computed('name', function () {
    return `modals/${this.name}`;
  }),

  renderOptions: computed(...renderOptions, function () {
    return this.getProperties(...renderOptions);
  })
});

export default Service.extend(Evented, {
  open(name, options) {
    let { model, ...params } = options;
    let modal = Modal.create({ name, model, params });
    let currentUrl = window.location.href;
    if (currentUrl[currentUrl.length - 1] !== '#') {
      window.history.pushState(
        window.history.state,
        document.title,
        `${currentUrl}#`
      );
    }

    this.set('modalIsOpen', true);
    this.trigger('open', modal);
  },

  close() {
    let currentUrl = window.location.href;
    if (currentUrl[currentUrl.length - 1] === '#' && this.modalIsOpen) {
      window.history.back();
    }

    this.set('modalIsOpen', false);
    this.trigger('close');
  }
});
