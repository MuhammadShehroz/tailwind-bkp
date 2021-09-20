import Component from '@ember/component';
import DocumentFiltersComponent, {
  convertStatus
} from 'frontend/mixins/components/document-filters';

export default Component.extend(DocumentFiltersComponent, {
  classNames: ['invoices'],

  statusPastDue: convertStatus('past_due')
});
