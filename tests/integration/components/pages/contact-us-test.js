import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

module('Integration | Component | pages/contact-us', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register(
      'service:user',
      Service.extend({
        current: Promise.resolve({})
      })
    );
    this.owner.register(
      'service:organization',
      Service.extend({
        current: Promise.resolve({})
      })
    );
  });

  test('it renders', async function (assert) {
    await render(hbs`<Pages::ContactUs />`);

    assert.ok(this.element);
  });
});
