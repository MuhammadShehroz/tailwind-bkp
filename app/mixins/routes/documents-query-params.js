import Mixin from '@ember/object/mixin';

import { filterParams } from 'frontend/models/filters';
import { paginationParams } from 'frontend/mixins/pagination-info';

const refresh = { refreshModel: true };

export default function (options = { filterByClient: false }) {
  let queryParamKeys = filterParams.concat(paginationParams);
  let queryParams = {};

  queryParamKeys.forEach((queryParam) => {
    if (queryParam !== 'clientId') {
      queryParams[queryParam] = refresh;
    }
  });

  if (options.filterByClient) {
    queryParams.client_id = refresh; // eslint-disable-line camelcase
  }

  return Mixin.create({
    queryParams
  });
}
