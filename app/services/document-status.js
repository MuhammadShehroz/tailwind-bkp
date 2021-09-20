import Service from '@ember/service';

const STATUS_LABELS = {
  draft: 'Draft',
  open: 'Open',
  past_due: 'Past Due', // eslint-disable-line camelcase
  closed: 'Closed',
  approved: 'Approved',
  declined: 'Declined',
  converted: 'Converted'
};

export default Service.extend({
  statusLabel(statusSymbol) {
    return STATUS_LABELS[statusSymbol];
  }
});
