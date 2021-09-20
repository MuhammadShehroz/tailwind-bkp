import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

module('Unit | Model | user', function (hooks) {
  setupTest(hooks);

  test('name', function (assert) {
    let model = this.owner.lookup('service:store').createRecord('user');

    assert.equal(model.get('name'), '');

    run(() => {
      model.set('firstName', 'Stan');
    });

    assert.equal(model.get('name'), 'Stan');

    run(() => {
      model.set('lastName', 'Marsh');
    });

    assert.equal(model.get('name'), 'Stan Marsh');
  });

  test('initials', function (assert) {
    let model = this.owner.lookup('service:store').createRecord('user');

    assert.equal(model.get('initials'), '');

    run(() => {
      model.set('firstName', 'Stan');
    });

    assert.equal(model.get('initials'), 'S');

    run(() => {
      model.set('lastName', 'Marsh');
    });

    assert.equal(model.get('initials'), 'SM');
  });
});
