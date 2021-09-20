/* global Modernizr */
import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';

const IframeSandbox = Component.extend({
  tagName: 'iframe',
  attributeBindings: ['style'],
  show: false,

  style: computed('show', function () {
    let visibility = this.show ? 'visible' : 'hidden';
    return htmlSafe(`visibility: ${visibility}`);
  }),

  didInsertElement() {
    this.onLoadEvent = () => {
      let height;

      if (Modernizr.srcdoc) {
        height =
          this.element.contentDocument.querySelector('html').scrollHeight;
      } else {
        height = this.element.contentWindow.document.body.offsetHeight;
      }

      this.onLoad(height);
    };

    this.element.addEventListener('load', this.onLoadEvent);
  },

  willDestroyElement() {
    this.element.removeEventListener('load', this.onLoadEvent);
  }
});

if (Modernizr.srcdoc) {
  IframeSandbox.reopen({
    attributeBindings: ['srcdoc'],
    srcdoc: computed('content', function () {
      return htmlSafe(this.content);
    }).readOnly()
  });
} else {
  IframeSandbox.reopen({
    didRender() {
      this._super(...arguments);
      let doc =
        this.element.contentWindow ||
        this.element.contentDocument.document ||
        this.element.contentDocument;

      doc.document.open();
      doc.document.write(this.content);
      doc.document.close();
    }
  });
}

export default IframeSandbox;
