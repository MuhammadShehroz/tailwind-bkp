import { module, test } from 'qunit';
import underscoreQuery from 'frontend/utils/underscore-query';

module('Unit | Utility | underscore-query', function () {
  let query = {
    clientId: 9300,
    estimateId: 4052,
    invoiceId: '',
    templateId: null
  };
  test('transform query params to underscore form', function (assert) {
    let preparedQuery = underscoreQuery(query);
    assert.deepEqual(Object.keys(preparedQuery), ['client_id', 'estimate_id']);
  });
});
