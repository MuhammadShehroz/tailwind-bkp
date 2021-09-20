import Component from '@ember/component';
import DocumentFiltersComponent, {
  convertStatus
} from 'frontend/mixins/components/document-filters';

export default Component.extend(DocumentFiltersComponent, {
  classNames: ['estimates'],

  statusApproved: convertStatus('approved'),
  statusDeclined: convertStatus('declined'),
  statusConverted: convertStatus('converted')
});
