const options = {
  test_page: 'tests/index.html?hidepassed',
  disable_watching: true,

  launch_in_ci: [
    'Chrome'
  ],

  launch_in_dev: [
    'Chrome'
  ]
,
  browser_args: {
    Chrome: [
      process.env.CI ? '--no-sandbox' : null,
      '--headless',
      '--crash-dumps-dir=/tmp',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-software-rasterizer',
      '--mute-audio',
      '--remote-debugging-port=0',
      '--window-size=1440,900'
    ]
  }
};

if (process.env.CIRCLECI) {
  options.reporter = 'xunit';
  options.report_file = '/tmp/test-results/ember.xml'
}

module.exports = options;
