import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
import Application from '@ember/application';
import TextField from '@ember/component/text-field';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
import './models/custom-inflector-rules';

const { deployTarget } = config;

if (deployTarget === 'production') {
  Sentry.init({
    dsn: 'https://f356e1a773c4458197bec999de43e946@o17673.ingest.sentry.io/5679863',

    environment: deployTarget,
    integrations: [new Integrations.Ember()],
    whitelistUrls: ['https://app.blinksale.com'],
    ignoreErrors: ['TransitionAborted']
  });
}

if (deployTarget === 'dev') {
  Sentry.init({
    dsn: 'https://b8fef37046b84362a6f4dffc476f95fd@o385326.ingest.sentry.io/5217859',

    environment: deployTarget,
    integrations: [new Integrations.Ember()],
    whitelistUrls: ['https://app.blinksale.net'],
    ignoreErrors: ['TransitionAborted']
  });
}

const App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;

TextField.reopen({
  attributeBindings: ['data-lpignore']
});
