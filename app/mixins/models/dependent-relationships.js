import Mixin from '@ember/object/mixin';

function _deleteRecords(recordsToDelete) {
  recordsToDelete.forEach((record) => {
    record.rollbackAttributes();
  });
}

export default Mixin.create({
  _recordsToDelete() {
    let recordsToDelete = [];
    this.eachRelationship((name, descriptor) => {
      if (descriptor.kind === 'hasMany') {
        this.get(name).forEach((object) => {
          if (object.get('isNew')) {
            recordsToDelete.push(object);
          }
        });
      } else if (descriptor.kind === 'belongsTo') {
        let object = this.get(name);
        if (object && object.get('isNew')) {
          recordsToDelete.push(object);
        }
      }
    });

    return recordsToDelete;
  },

  save() {
    let recordsToDelete = this._recordsToDelete();
    let promise = this._super(...arguments);

    promise.then(() => _deleteRecords(recordsToDelete));

    return promise;
  },

  rollbackAttributes() {
    _deleteRecords(this._recordsToDelete());
    return this._super(...arguments);
  }
});
