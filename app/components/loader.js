import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';

export default Component.extend({
  tagName: 'div',
  classNames: ['flex', 'justify-center'],
  classNameBindings: ['isLoading:visible'],
  progressBarClass: null,
  message: 'Loading...',

  loader: service(),

  init() {
    this._super(...arguments);

    this.loader.on('startLoading', this, this.startLoading);
    this.loader.on('endLoading', this, this.endLoading);
  },

  willDestroy() {
    run.once(this, this.removeLoader);
  },

  removeLoader() {
    this.loader.off('startLoading', this, this.startLoading);
    this.loader.off('endLoading', this, this.endLoading);
  },

  startLoading(message) {
    this.setProperties({
      isLoading: true,
      message
    });
  },

  endLoading() {
    this.setProperties({
      isLoading: false,
      message: 'Loading...'
    });
  }
});
