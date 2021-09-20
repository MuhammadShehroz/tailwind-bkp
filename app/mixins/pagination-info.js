import Mixin from '@ember/object/mixin';
import { reads, notEmpty, or } from '@ember/object/computed';

export const paginationParams = ['order', 'page', 'sort'];

export default Mixin.create({
  prev: reads('pagination.prev'),
  current: reads('pagination.self'),
  next: reads('pagination.next'),
  last: reads('pagination.last'),

  hasPrev: notEmpty('prev'),
  hasNext: notEmpty('next'),

  hasPages: or('hasNext', 'hasPrev')
});
