import { reads } from '@ember/object/computed';
import ArrayProxy from '@ember/array/proxy';

export default ArrayProxy.extend({
  meta: reads('content.meta')
});
