import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

module('Unit | Model | client', function (hooks) {
  setupTest(hooks);

  test('firstLetter', function (assert) {
    let model = this.owner.lookup('service:store').createRecord('client');

    assert.equal(model.get('firstLetter'), '');

    run(() => {
      model.set('name', 'foo');
    });

    assert.equal(model.get('firstLetter'), 'F');
  });

  test('isCompany', function (assert) {
    assert.expect(2);

    let model = this.owner.lookup('service:store').createRecord('client');
    assert.equal(model.get('isCompany'), true);

    run(() => {
      model.set('isCompany', false);
    });

    assert.equal(model.get('kind'), 'person');
  });

  test('company validations', async function (assert) {
    assert.expect(4);

    let model = this.owner
      .lookup('service:store')
      .createRecord('client', { isCompany: true });

    await model.validate();
    assert.notOk(model.get('validations.isValid'), 'missing company name');

    run(() => model.set('companyName', 'Acme Inc.'));

    await model.validate();
    assert.ok(model.get('validations.isValid'), 'company name');

    run(() => model.set('isCompany', false));

    await model.validate();
    assert.notOk(
      model.get('validations.isValid'),
      'missing person first/last name'
    );

    run(() =>
      model.setProperties({
        firstName: 'Stan',
        lastName: 'Marsh',
        email: 'stan@bsn.test'
      })
    );

    await model.validate();
    assert.ok(model.get('validations.isValid'), 'person first/last name');
  });
});
