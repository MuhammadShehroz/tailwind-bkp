import { A } from '@ember/array';
import { module, test } from 'qunit';
import EmberObject from '@ember/object';
import ClientList from 'frontend/utils/filter/client-list';
import DocumentFilter from 'frontend/utils/filter/document-filter';

module('Unit | Utility | filter/document-filter', function () {
  let documentFilter = new DocumentFilter();
  let clients = A();
  let status = A();
  clients.pushObjects([
    EmberObject.create({ id: 1, name: 'client A' }),
    EmberObject.create({ id: 3, name: 'client B' })
  ]);
  status.pushObject();
  documentFilter.clients = ClientList.create({ clients }).clients;
  documentFilter.clientId = 1;
  documentFilter.status = ['open'];
  documentFilter.dateRange = { value: 'quarter', label: 'Quarter' };

  test('set up options lists', function (assert) {
    assert.equal(documentFilter.clients.length, 3);
    assert.equal(documentFilter.selectedClient.id, 1);
    assert.equal(
      documentFilter.selectedStatus(documentFilter.status),
      documentFilter.statuses[2]
    );
    assert.equal(documentFilter.selectedDateRange.value, 'quarter');
  });
});
