import { A } from '@ember/array';
import { computed } from '@ember/object';

const ALL_CLIENTS_ENTRY = { name: 'All Clients', value: null };

export default class DocumentFilter {
  status = A();

  clients = A();

  statuses = A();

  dateRanges = A();

  constructor(statusList) {
    this.statuses.pushObjects(statusList);
    this.dateRanges.pushObjects([
      { value: 'all', label: 'All Time' },
      { value: 'month', label: 'Month' },
      { value: 'quarter', label: 'Quarter' },
      { value: 'year', label: 'Year' }
    ]);
  }

  selectedStatus(status) {
    return (
      this.statuses.find((item) => status.includes(item.value)) ||
      this.statuses.firstObject
    );
  }

  @computed('clientId', 'clients')
  get selectedClient() {
    return (
      this.clients.find(
        (client) => `${client.get('id')}` === `${this.clientId}`
      ) || ALL_CLIENTS_ENTRY
    );
  }

  @computed('dateRange.value', 'dateRanges.[]')
  get selectedDateRange() {
    return (
      this.dateRanges.find(
        (dateRange) => dateRange.value === this.dateRange?.value
      ) || this.dateRanges.firstObject
    );
  }
}
