let InvoiceStatusList = [
  { value: null, label: 'All Invoices' },
  { value: 'draft', label: 'Draft' },
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
  { value: 'past_due', label: 'Past Due' }
];

let EstimateStatusList = [
  { value: null, label: 'All Estimates' },
  { value: 'draft', label: 'Draft' },
  { value: 'open', label: 'Open' },
  { value: 'approved', label: 'Approved' },
  { value: 'declined', label: 'Declined' },
  { value: 'converted', label: 'Converted' }
];

export { InvoiceStatusList, EstimateStatusList };
