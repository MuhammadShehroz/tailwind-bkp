'use strict';

const deployTarget = process.env.DEPLOY_TARGET || 'development';
const stripeClientId = 'ca_FqCwh6zZkuO6WQhZ83m7k8nJrHqVpDkr';
const stripePublishableKey = 'pk_test_Bv7s7srb6Ae3VuGi1qp2I4gn00fThkXRyk';
const paypalClientId =
  'ATA4VPxlh5PXiqXnMtjBom-5UQ1DiFRZEOfx2ZrddnsJnvPLs4RMjJrpwnNxoMbALk3AqFEKNwStrksR';
const apiHost = process.env.API_HOST || '';

const plaidTestConfig = {
  clientName: '60ae2f72c72d7b0011ff9b43',
  product: 'link',
  key: '18d00be17470e05f0d8f11e61af32e',
  env: 'sandbox'
};
const plaidProdConfig = {
  clientName: '60ae2f72c72d7b0011ff9b43',
  product: 'link',
  key: '8733599ba9c3c547f0b9c0aaab29ac',
  env: 'development'
};

const plaidConfig = {
  dev: plaidTestConfig,
  development: plaidTestConfig,
  staging: plaidTestConfig,
  production: plaidProdConfig
};

const gtmEnvParams = {
  production:
    'uiv2&check_preview_status=1&gtm_auth=GG9jh4G2M86k9FbnHbdf2Q&gtm_preview=env-2&gtm_debug=',

  staging:
    'uiv2&check_preview_status=1&gtm_auth=pVtTeHiPP-E1kcEEgTmNrw&gtm_preview=env-22&gtm_debug=x',

  development:
    'uiv2&check_preview_status=1&gtm_auth=e2Xc1r1uiZ-o22nl8wffqQ&gtm_preview=env-21&gtm_debug=',

  dev: 'uiv2&check_preview_status=1&gtm_auth=pVtTeHiPP-E1kcEEgTmNrw&gtm_preview=env-22&gtm_debug='
};

module.exports = function (environment) {
  let ENV = {
    modulePrefix: 'frontend',
    deployTarget,
    environment,
    rootURL: '/',
    locationType: 'auto',
    stripe: {
      clientId: stripeClientId,
      publishableKey: stripePublishableKey,
      mock: environment === 'test'
    },

    paypal: {
      clientId: paypalClientId
    },

    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },

      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      apiHost
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    flashMessageDefaults: {
      destroyOnClick: false,
      isInline: false
    },

    flashMessageRegularTimeout: 5000,
    flashActionMessageTimeout: 10000,

    'ember-component-css': {
      classicStyleDir: 'components'
    },

    moment: {
      includeLocales: false,
      includeTimezone: 'none'
    },

    metricsAdapters: [
      {
        name: 'GoogleTagManager',
        environments: ['development', 'production'],
        config: {
          id: 'GTM-PHNJGW8',
          envParams: gtmEnvParams[deployTarget]
        }
      },
      {
        name: 'CustomerIo',
        environments: ['development', 'production'],
        config: {
          siteId:
            deployTarget === 'production'
              ? '19d1f6d934bcce473d39'
              : 'f2395e2783562b8e6fcc'
        }
      }
    ],

    'ember-plaid': plaidConfig[deployTarget]
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  if (deployTarget === 'dev') {
    ENV.APP.apiHost = 'https://api.blinksale.net';
    ENV.stripe.clientId = 'ca_H3PI8RofTMTJgatMdlStS7uO480EORkM';
    ENV.stripe.publishableKey = 'pk_test_qcuqjj1m0n4mAgpBWEQnxNvw00CSLXpZkN';
    ENV.paypal.clientId =
      'AWel3UK7cTaPWfCU6zy3U1tA4XTnlraOr9cYrLgspRrXz84GmedkFscG-nasmWidnthVOx4fR5s5AxVc';
  } else if (deployTarget === 'staging') {
    ENV.APP.apiHost = 'https://api.blinkstage.com';
    ENV.stripe.clientId = 'ca_FqCwh6zZkuO6WQhZ83m7k8nJrHqVpDkr';
    ENV.stripe.publishableKey = 'pk_test_Bv7s7srb6Ae3VuGi1qp2I4gn00fThkXRyk';
    ENV.paypal.clientId =
      'ATZXP4YeqEDBrJWrIce4j94gIEJxgWxmvxlehUrAGbaL8LMcprI1v_aYRKaO0_jbc1iuzsHRif6j2Aab';
  } else if (deployTarget === 'production') {
    ENV.APP.apiHost = 'https://api.blinksale.com';
    ENV.stripe.clientId = 'ca_FqCw9Wbgu21P71F0dsagDma7mEuOE8fs';
    ENV.stripe.publishableKey = 'pk_live_AOWLgaOtydzXaSn2AsF5YpFR00VHMJFbsB';
    ENV.paypal.clientId =
      'AVvnl2T9HIUo_LduUJKTNS_NExF3fo1Xy4bNPM3jzdKyIM1MnHWggljIhyoK_j3NWqD-oq4ZUDw1Wd-f';
  }

  return ENV;
};
