import { assert } from '@ember/debug';
import { assign } from '@ember/polyfills';

function buildOperationUrl(record, opPath, urlType, instance = true) {
  assert('You must provide a path for instanceOp', opPath);
  let modelName = record.constructor.modelName || record.constructor.typeKey;
  let adapter = record.store.adapterFor(modelName);
  let path = opPath;
  let snapshot = record._createSnapshot();
  let baseUrl = adapter.buildURL(
    modelName,
    instance ? record.get('id') : null,
    snapshot,
    urlType
  );

  if (baseUrl.charAt(baseUrl.length - 1) === '/') {
    return `${baseUrl}${path}`;
  } else {
    return `${baseUrl}/${path}`;
  }
}

function parseOptions(name, options) {
  return assign(
    {
      path: name,
      notification: name,
      method: 'PATCH',
      ajaxOptions: {},
      updateStore: true
    },
    options
  );
}

export function memberAction(name, opt) {
  let options = parseOptions(name, opt || {});

  return function (payload) {
    let modelName = this.constructor.modelName || this.constructor.typeKey;
    let adapter = this.store.adapterFor(modelName);
    let method = options.method.toUpperCase();
    let fullUrl = buildOperationUrl(this, options.path, method);

    let ajaxOptions = assign(
      adapter.ajaxOptions(fullUrl, method, {
        dataType: 'text',
        data: payload
      }),
      options.ajaxOptions
    );

    let request = this.ajax.request(fullUrl, ajaxOptions);

    if (options.updateStore) {
      request = request.then((data) => {
        this.store.pushPayload(modelName, data);
        return data;
      });
    }

    return request;
  };
}

export function collectionAction(name, opt) {
  let options = parseOptions(name, opt);

  return function (payload) {
    let modelName = this.constructor.modelName || this.constructor.typeKey;
    let adapter = this.store.adapterFor(modelName);
    let method = options.method.toUpperCase();
    let fullUrl = buildOperationUrl(this, options.path, method, false);

    let ajaxOptions = assign(
      adapter.ajaxOptions(fullUrl, method, {
        dataType: 'text',
        data: payload
      }),
      options.ajaxOptions
    );

    return this.ajax.request(fullUrl, ajaxOptions);
  };
}
