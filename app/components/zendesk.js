import Component from '@ember/component';
import { Promise as EmberPromise } from 'rsvp';

const src =
  'https://static.zdassets.com/ekr/snippet.js?key=da890e11-b3ab-484f-ae4f-c1005e66e0cd';

export default Component.extend({
  async init() {
    this._super(...arguments);

    await new EmberPromise((resolve, reject) => {
      let script = document.createElement('script');
      script.id = 'ze-snippet';
      script.type = 'text/javascript';
      script.async = true;
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.getElementsByTagName('body')[0].appendChild(script);
    });
    zE('webWidget', 'hide');

    zE('webWidget:on', 'close', () => {
      zE('webWidget', 'hide');
    });
  }
});
