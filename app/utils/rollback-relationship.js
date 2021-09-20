const rollback = (model) =>
  model?.hasDirtyAttributes && model.rollbackAttributes();

const findRelationship = (model, name) => {
  let relationship;

  model.eachRelationship((_name, descriptor) => {
    if (name === _name) {
      relationship = descriptor;
    }
  });

  return relationship;
};

const _rollbackRelationship = (model, descriptor) => {
  if (descriptor?.kind === 'belongsTo')
    rollback(model.belongsTo(descriptor.key).value());

  if (descriptor?.kind === 'hasMany')
    model.hasMany(descriptor.key).value().forEach(rollback);
};

const rollbackRelationship = (model, name) => {
  _rollbackRelationship(model, findRelationship(model, name));
};

const rollbackRelationships = (model) =>
  model.eachRelationship((name, descriptor) =>
    _rollbackRelationship(model, descriptor)
  );

export { rollbackRelationship, rollbackRelationships };
