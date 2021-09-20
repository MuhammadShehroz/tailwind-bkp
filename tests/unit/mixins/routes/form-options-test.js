import EmberObject from '@ember/object';
import RoutesFormOptionsMixin from 'frontend/mixins/routes/form-options';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/form-options', function () {
  // TODO: Replace this with your real tests.
  test('it works', function (assert) {
    let RoutesFormOptionsObject = EmberObject.extend(RoutesFormOptionsMixin);
    let subject = RoutesFormOptionsObject.create();
    assert.ok(subject);
  });
});
