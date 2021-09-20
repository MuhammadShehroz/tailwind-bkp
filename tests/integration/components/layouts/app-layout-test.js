import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';
import Service from '@ember/service';

const OrganizationService = Service.extend({
  current: EmberObject.create({
    currentUserRole: 'owner'
  })
});
const OrgMembershipService = Service.extend({
  init() {
    this._super(...arguments);
    this.current = {};
  },

  notifications: () => []
});

module('Integration | Component | layouts/app-layout', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:organization', OrganizationService);
    this.owner.register(
      'service:organization-membership',
      OrgMembershipService
    );
  });

  test('it renders', async function (assert) {
    assert.expect(3);

    await render(hbs`
      {{#layouts/app-layout}}
        template block text
      {{/layouts/app-layout}}
    `);

    assert.dom('header#app-nav').exists();
    assert.dom('footer#footer').exists();
    assert.dom('main').hasText('template block text');
  });
});
