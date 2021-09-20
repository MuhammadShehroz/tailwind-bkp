import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, clearRender } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

module('Integration | Component | pages/dashboard', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register(
      'service:organization',
      Service.extend({
        init() {
          this._super(...arguments);
          this.current = {
            invoiceCreatedAt: null
          };
        }
      })
    );
  });

  test('it renders', async function (assert) {
    await render(hbs`<Pages::Dashboard />`);

    assert.dom('.invoice-stats').exists({ count: 1 });
    assert.dom('.blank-slate').exists({ count: 1 });

    clearRender();
    this.owner
      .lookup('service:organization')
      .set('current.invoiceCreatedAt', Date.now());
    await render(hbs`<Pages::Dashboard />`);

    assert.dom('.invoice-stats').exists({ count: 1 });
    assert.dom('.blank-slate').exists({ count: 1 });

    clearRender();
    this.owner.lookup('service:user').set('current.isLoaded', true);
    await render(hbs`<Pages::Dashboard />`);

    assert.dom('.invoice-stats').exists({ count: 1 });
    assert.dom('.blank-slate').exists({ count: 1 });

    clearRender();
    this.owner.lookup('service:user').set('current.confirmedAt', Date.now());
    await render(hbs`<Pages::Dashboard />`);

    assert.dom('.invoice-stats').exists({ count: 1 });
    assert.dom('.blank-slate').exists({ count: 1 });
  });
});
