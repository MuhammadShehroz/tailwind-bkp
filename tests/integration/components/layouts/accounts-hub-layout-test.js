import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';
const OrganizationService = EmberObject.extend({
  current: EmberObject.create({
    currentUserRole: 'owner'
  })
});

module(
  'Integration | Component | layout/accounts-hub-layout',
  function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
      this.owner.register('service:organization', OrganizationService);
    });

    test('it renders', async function (assert) {
      assert.expect(3);

      await render(hbs`
      {{#layouts/accounts-hub-layout}}
        template block text
      {{/layouts/accounts-hub-layout}}
    `);

      assert.dom('header#accounts-hub-nav').exists();
      assert.dom('footer#footer').exists();
      assert.dom('main').hasText('template block text');
    });
  }
);
