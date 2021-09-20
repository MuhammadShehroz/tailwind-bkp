import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { sortByID } from 'frontend/lib/sort-by-id';

export default Service.extend({
  store: service(),

  queryTaxes() {
    return this.store.findAll('tax');
  },

  existingTaxes: computed('reload', function () {
    return this.store.query('tax', {});
  }),

  all: computed(function () {
    return this.store.findAll('tax');
  }),

  sorted: sortByID('all.[]'),

  saveTaxes(taxesToUpdate, taxesToDelete) {
    let adapter = this.store.adapterFor('tax');
    let url = adapter.urlForFindAll('tax');
    let attributes = taxesToUpdate.map((tax) => {
      if (!tax.isDeleted) {
        return tax.toJSON({ includeId: true });
      }
    });

    taxesToDelete.forEach(function (tax) {
      attributes.pushObject({
        id: tax.id,
        _destroy: 1
      });
    });

    return adapter.ajax(url, 'PATCH', {
      // eslint-disable-next-line camelcase
      data: { taxes_attributes: attributes }
    });
  }
});
