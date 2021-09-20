import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import EmberObject from '@ember/object';
const Service = EmberObject.extend({});

module('Unit | Controller | Signup', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:metrics', Service);
    this.owner.register('service:plan', Service);
  });

  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:signup');
    assert.ok(controller);
  });
});
