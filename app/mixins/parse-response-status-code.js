function parseResponseStatusCode(response) {
  let { status } = response;

  if (!status && response.errors && response.errors[0].status) {
    ({ status } = response.errors[0]);
  }

  return status;
}

export { parseResponseStatusCode };
