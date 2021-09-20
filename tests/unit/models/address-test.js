import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | address', function (hooks) {
  setupTest(hooks);

  test('short, no attributes', function (assert) {
    assert.expect(1);
    assert.equal(
      this.owner.lookup('service:store').createRecord('address').get('short'),
      ''
    );
  });

  test('short, with all attributes', function (assert) {
    assert.expect(1);

    let model = this.owner.lookup('service:store').createRecord('address', {
      address1: 'Test address1',
      address2: 'Test address2',
      city: 'Cityland',
      subregion: 'UNK',
      country: 'Unkownia',
      zip: '888888'
    });
    assert.equal(
      model.get('short'),
      'Test address1 Test address2, Cityland, UNK 888888, Unkownia'
    );
  });

  test('short, with missing attributes', function (assert) {
    assert.expect(7);

    let model = this.owner.lookup('service:store').createRecord('address', {
      address1: 'Test address1',
      address2: 'Test address2',
      city: 'Cityland',
      subregion: 'UNK',
      country: 'Unkownia'
    });
    assert.equal(
      model.get('short'),
      'Test address1 Test address2, Cityland, UNK, Unkownia'
    );

    model.set('address1', undefined);
    assert.equal(model.get('short'), 'Test address2, Cityland, UNK, Unkownia');

    model.set('address2', undefined);
    model.set('city', undefined);
    assert.equal(model.get('short'), 'UNK, Unkownia');

    model.set('zip', '888888');
    assert.equal(model.get('short'), 'UNK 888888, Unkownia');

    model.set('subregion', undefined);
    assert.equal(model.get('short'), '888888, Unkownia');

    model.set('zip', undefined);
    assert.equal(model.get('short'), 'Unkownia');

    model.set('country', undefined);
    assert.equal(model.get('short'), '');
  });
});
