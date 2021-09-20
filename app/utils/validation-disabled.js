export default function validationDisabled() {
  let { model } = this;
  let attr = this.attribute;
  let attrs = model.changedAttributes();
  let hasChangedAttribute = Object.keys(attrs).includes(attr);
  return !(hasChangedAttribute || model.validationsEnabled);
}
