import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | invoice line item', function (hooks) {
  setupTest(hooks);

  function isValid(model) {
    return model.get('validations.isValid');
  }

  test('isValid', function (assert) {
    assert.ok(
      isValid(
        this.owner.lookup('service:store').createRecord('invoice-line-item', {
          name: 'foo',
          price: 125.0,
          quantity: 5.1
        })
      ),
      'valid'
    );
  });

  [
    { msg: 'missing name', attrs: { name: undefined, price: 1, quantity: 1 } },
    { msg: 'missing price', attrs: { name: 'foo', price: null, quantity: 1 } },
    {
      msg: 'missing quantity',
      attrs: { name: 'foo', price: 1, quantity: null }
    },
    {
      msg: 'non numeric quantity',
      attrs: { name: 'foo', price: 1, quantity: 'a' }
    }
  ].forEach((v) => {
    test(`isInvalid: ${v.msg}`, function (assert) {
      assert.notOk(
        isValid(
          this.owner
            .lookup('service:store')
            .createRecord('invoice-line-item', v.attrs)
        )
      );
    });
  });

  test('calculations, no tax', function (assert) {
    assert.expect(4);

    let model = this.owner
      .lookup('service:store')
      .createRecord('invoice-line-item', { price: 6, quantity: 7 });

    assert.equal(model.get('total'), 42.0, 'total');
    assert.equal(model.get('taxableTotal'), 42.0, 'taxableTotal');
    assert.equal(model.get('taxAmount'), 0, 'taxAmount');
    assert.equal(model.get('taxFraction'), 0, 'taxFraction');
  });
});
