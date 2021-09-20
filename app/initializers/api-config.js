/* eslint-disable camelcase */
import request from 'ember-ajax/request';
import ENV from 'frontend/config/environment';

const FALLBACK_CONFIG = {
  max_file_size_bytes: 10000000,

  document: {
    net_terms: {
      immediately: { label: 'Immediately', days: 0 },
      net15: { label: 'NET 15', days: 15 },
      net30: { label: 'NET 30', days: 30 },
      net45: { label: 'NET 45', days: 45 },
      net60: { label: 'NET 60', days: 60 },
      other: { label: 'Other', days: null }
    }
  },

  organization: {
    separatorOptions: ['.', ',', ' ', ''],
    decimalsOptions: [0, 1, 2, 3, 4],
    dateFormats: {
      mmm_d_yyyy: { format: '%b %-d, %Y', js_format: 'MMM D, YYYY' },
      mmmm_d_yyyy: { js_format: 'MMMM D, YYYY' },
      d_mmm_yyyy: { js_format: 'D MMM YYYY' },
      d_mmmm_yyyy: { js_format: 'D MMMM YYYY' },
      m_d_yyyy_slash: { js_format: 'MM/DD/YYYY' },
      d_m_yyyy_slash: { js_format: 'DD/MM/YYYY' }
    }
  }
};

export function initialize(application) {
  let url = `${ENV.APP.apiHost}/api/config`;

  application.deferReadiness();

  request(url)
    .then(function (result) {
      window.BSN = result;
    })
    .catch(function () {
      window.BSN = FALLBACK_CONFIG;
    })
    .finally(function () {
      application.advanceReadiness();
    });
}

export default {
  initialize
};
