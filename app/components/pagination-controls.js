import { reads } from '@ember/object/computed';
import Component from '@ember/component';
import EmberObject, { computed } from '@ember/object';
import PaginationInfo from 'frontend/mixins/pagination-info';
import { inject as service } from '@ember/service';

const Page = EmberObject.extend({});

function center(current, last) {
  let start, end;

  if (last <= 5) {
    start = 1;
    end = last;
  } else if (last - current <= 3) {
    start = Math.max(current - (4 - last + current), 1);
    end = Math.min(last, start + 4);
  } else {
    start = Math.max(current - 2, 1);
    end = Math.min(last, start + 4);
  }

  return [start, end];
}

export default Component.extend(PaginationInfo, {
  classNames: ['tw-pagination'],
  router: service(),

  routeName: reads('router.currentRouteName'),

  pages: computed('current.number', 'last.number', 'pagination', function () {
    let currentNumber = this.current.number;
    let [start, end] = center(currentNumber, this.last.number);
    let pages = [];

    for (let number = start; number <= end; number++) {
      pages.addObject(
        Page.create({
          number,
          isCurrent: number === currentNumber
        })
      );
    }

    return pages;
  })
});
