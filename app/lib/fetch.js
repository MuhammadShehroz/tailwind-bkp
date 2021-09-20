import fetch from 'fetch';

const _fetch = async (url, options) => {
  let response = await fetch(url, options);
  let { ok, status } = response;

  if (ok && status >= 200 && status <= 299) return response;
  throw response;
};

export default _fetch;
