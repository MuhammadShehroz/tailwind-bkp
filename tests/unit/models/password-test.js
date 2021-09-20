import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

module('Unit | Model | password', function (hooks) {
  setupTest(hooks);

  test('validations', async function (assert) {
    assert.expect(5);

    let model = this.owner.lookup('service:store').createRecord('password');

    await model.validate();
    assert.notOk(model.get('validations.isValid'), 'missing password');

    run(() => model.set('password', 'superSecurePassword123'));

    await model.validate();
    assert.notOk(
      model.get('validations.isValid'),
      'missing passwordConfirmation'
    );

    run(() => model.set('password', '111'));

    await model.validate();
    assert.notOk(model.get('validations.isValid'), 'password too short');

    run(() =>
      model.setProperties({
        password: 'superSecurePassword123',
        passwordConfirmation: 'superSecurePassword'
      })
    );

    await model.validate();
    assert.notOk(model.get('validations.isValid'), 'passwords do not match');

    run(() =>
      model.setProperties({
        password: 'superSecurePassword123',
        passwordConfirmation: 'superSecurePassword123'
      })
    );
    assert.ok(model.get('validations.isValid'), 'valid');
  });
});
