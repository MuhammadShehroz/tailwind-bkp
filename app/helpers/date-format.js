import { helper } from '@ember/component/helper';
import moment from 'moment';

const { dateFormats } = window.BSN.organization;

export function dateFormat(date, format) {
  let _format = format || dateFormats.d_mmm_yyyy.js_format;
  return moment(date).utc().format(_format);
}

export default helper(dateFormat);
