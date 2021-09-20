import EmberObject from '@ember/object';
import FormBaseMixin from 'frontend/mixins/form-base';
import { module, test } from 'qunit';

const validations = {
  isValid: false,
  errors: []
};

const TestModel = EmberObject.extend({
  validations,

  validate() {
    return Promise.resolve(this.validations.isValid);
  }
});

module('Unit | Mixin | form-base', function () {
  test('it works', function (assert) {
    let FormBaseObject = EmberObject.extend(FormBaseMixin);
    let subject = FormBaseObject.create();
    assert.ok(subject);
  });

  test('test validateForm method', async function (assert) {
    let FormBaseObject = EmberObject.extend(FormBaseMixin);
    let validSubject = FormBaseObject.create();
    validSubject.set(
      'model',
      TestModel.create({ validations: { isValid: true } })
    );
    validSubject
      .validateForm()
      .then(() => assert.true(true, 'Validation is resolved'));

    let invalidSubject = FormBaseObject.create();
    invalidSubject.set(
      'model',
      TestModel.create({
        validations: { isValid: false, errors: ['first error'] }
      })
    );

    invalidSubject.validateForm().catch((error) => {
      assert.true(true, 'Validation is rejected');
      assert.deepEqual(error, ['first error'], 'Validation error');
    });
  });

  test('test saveChain method', async function (assert) {
    let FormBaseObject = EmberObject.extend(FormBaseMixin);
    let validSubject = FormBaseObject.create();
    validSubject.set(
      'model',
      TestModel.create({
        validations: { isValid: true },
        save: () => Promise.resolve()
      })
    );
    validSubject.set('flashMessages', {
      add: () => {}
    });

    let invalidSubject = FormBaseObject.create();
    invalidSubject.set(
      'model',
      TestModel.create({
        validations: { isValid: false, errors: ['first error'] },
        save: () => Promise.reject()
      })
    );

    validSubject
      .saveChain()
      .then(() => assert.true(true, 'saveChain on valid model is resolved'));

    invalidSubject
      .saveChain()
      .catch(() => assert.true(true, 'saveChain on invalid model is rejected'));
  });
});
