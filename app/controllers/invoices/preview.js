import Controller from '@ember/controller';

export default class InvoicePreviewController extends Controller {
  queryParams = [
    {
      kind: {
        type: 'string'
      }
    }
  ];
}
