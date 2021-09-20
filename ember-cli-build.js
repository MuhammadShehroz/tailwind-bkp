'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const nodeSass = require('node-sass');

module.exports = function (defaults) {
  let options = {
    babel: {
      sourceMaps: 'inline',
      plugins: ['@babel/plugin-proposal-optional-chaining']
    },

    sourcemaps: {
      enabled: true
    },

    'ember-cli-babel': {
      includePolyfill: true
    },

    sassOptions: {
      implementation: nodeSass
    },

    hinting: true,

    stylelint: {
      linterConfig: {
        syntax: 'scss'
      }
    },

    outputPaths: {
      app: {
        css: {
          app: '/assets/frontend.css',
          tailwind: '/assets/tailwind.css'
        }
      }
    },

    postcssOptions: {
      compile: {
        enabled: false
      },

      filter: {
        enabled: true,
        include: ['assets/tailwind.css'],
        plugins: [
          require('postcss-import')(),
          require('tailwindcss')('./tailwind.config.js')
        ]
      }
    }
  };

  if (process.env.CI) {
    options['ember-cli-babel'] = { includePolyfill: false };
    options.autoprefixer = { sourcemap: false };
    options.babel.sourceMaps = false;
    options.hinting = false;
    options.tests = EmberApp.env() === 'test';
  }

  let app = new EmberApp(defaults, options);

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  app.import('vendor/modernizr-custom.js');

  return app.toTree();
};
