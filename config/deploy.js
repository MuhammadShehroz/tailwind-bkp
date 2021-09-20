let VALID_DEPLOY_TARGETS = ['development', 'dev', 'staging', 'production'];

module.exports = function (deployTarget) {
  if (VALID_DEPLOY_TARGETS.indexOf(deployTarget) === -1) {
    throw new Error(`Invalid deployTarget ${deployTarget}`);
  }

  let ENV = {
    build: {}
  };

  if (deployTarget === 'development') {
    ENV.build.environment = 'development';
    ENV.plugins = ['build'];
  } else {
    ENV.build.environment = 'production';

    let envPrefix = deployTarget.toUpperCase();
    let s3Config = {
      accessKeyId: process.env[`${envPrefix}_AWS_KEY`],
      secretAccessKey: process.env[`${envPrefix}_AWS_SECRET`],
      bucket: process.env[`${envPrefix}_AWS_BUCKET`],
      region: process.env[`${envPrefix}_AWS_REGION`]
    };

    ENV.s3 = s3Config;
    ENV['s3-index'] = Object.assign({}, s3Config, {
      allowOverwrite: true
    });
  }

  return ENV;
};
