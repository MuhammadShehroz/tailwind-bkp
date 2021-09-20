export default function (modelName) {
  return {
    queryParams: {
      page: { refreshModel: true }
    },

    model(params) {
      let modelParams = { page: { number: params.page } };
      let { extraParams } = this;

      if (extraParams) {
        modelParams[extraParams] = params[extraParams];
      }

      return this.store.query(modelName, modelParams);
    }
  };
}
