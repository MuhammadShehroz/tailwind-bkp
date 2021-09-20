import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForCreateRecord(modelName, snapshot) {
    let result = this._super(...arguments);

    if (snapshot.adapterOptions) {
      if (snapshot.adapterOptions.isConvertMode) {
        result = `${result}/convert_from_estimate`;
      }
    }

    return result;
  },

  plaidLinkToken(record) {
    return fetch(`${this.buildURL('invoice', record.id)}/plaid_token`, {
      method: 'GET',
      headers: this.headers
    });
  },

  plaidPublicToken(record, publicToken, accountId) {
    return fetch(`${this.buildURL()}/stripe_bank_accounts`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        // eslint-disable-next-line camelcase
        bank_detail: {
          // eslint-disable-next-line camelcase
          public_token: publicToken,
          // eslint-disable-next-line camelcase
          invoice_id: record.id,
          // eslint-disable-next-line camelcase
          account_id: accountId
        }
      })
    });
  }
});
