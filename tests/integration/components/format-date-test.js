import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';

const OrganizationService = EmberObject.extend({
  current: EmberObject.create({
    jsDateFormat: 'MMM D, YYYY'
  })
});

module('Integration | Component | format-date', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:organization', OrganizationService);
  });

  test('it formats the date according to the organization setting', async function (assert) {
    let date = new Date('2019-10-04');

    this.set('date', date);

    await render(hbs`<FormatDate @date={{date}}/>`);

    assert.dom(this.element).hasText('Oct 4, 2019');
  });
});
