import BaseAdapter from 'ember-metrics/metrics-adapters/base';
import { assert } from '@ember/debug';
import removeFromDOM from 'ember-metrics/utils/remove-from-dom';
import { compact } from 'ember-metrics/utils/object-transforms';

export default BaseAdapter.extend({
  toStringExtension() {
    return 'customer-io';
  },

  init() {
    let { siteId } = this.config;

    assert(
      `[ember-metrics] You must pass a valid \`siteId\` to the ${this.toString()} adapter`,
      siteId
    );

    window._cio = window._cio || [];

    /* eslint-disable */
    (function() {
      var a, b, c;
      a = function(f) {
        return function() {
          _cio.push([f].concat(Array.prototype.slice.call(arguments, 0)));
        };
      };
      b = ['load', 'identify', 'sidentify', 'track', 'page'];
      for (c = 0; c < b.length; c++) {
        _cio[b[c]] = a(b[c]);
      }
      var t = document.createElement('script'),
        s = document.getElementsByTagName('script')[0];
      t.async = true;
      t.id = 'cio-tracker';
      t.setAttribute('data-site-id', siteId);
      t.src = 'https://assets.customer.io/assets/track.js';
      s.parentNode.insertBefore(t, s);
    })();
    /* eslint-enable */
  },

  identify(options = {}) {
    let compactedOptions = compact(options);
    let { distinctId } = compactedOptions;
    delete compactedOptions.distinctId;

    compactedOptions.id = distinctId;

    window._cio.identify(compactedOptions);
  },

  trackEvent() {},

  trackPage(options = {}) {
    let compactedOptions = compact(options);
    let { url } = compactedOptions;

    window._cio.page(url, compactedOptions);
  },

  alias() {},

  willDestroy() {
    removeFromDOM('script[src*="customer"]');

    delete window._cio;
  }
});
