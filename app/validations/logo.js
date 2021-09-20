import { validator, buildValidations } from 'ember-cp-validations';

const MAX_FILE_SIZE = window.BSN.max_file_size_bytes;

export default buildValidations({
  base: [
    validator('ds-error', {
      isWarning: true
    })
  ],

  size: [
    validator('number', {
      allowString: true,
      integer: true,
      lte: MAX_FILE_SIZE / 4,
      message: `Select file less than ${Math.round(
        MAX_FILE_SIZE / 1024 / 1024
      )} MB.`
    })
  ]
});
