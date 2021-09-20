import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

module('Unit | Service | window-message', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let service = this.owner.lookup('service:window-message');
    assert.equal(service.listeners.length, 0);
  });

  test('listeners is read only', function (assert) {
    let service = this.owner.lookup('service:window-message');
    assert.throws(() => (service.listeners = [1, 2, 3]));
  });

  test('it registers listeners', function (assert) {
    let service = this.owner.lookup('service:window-message');

    let listener1 = sinon.spy();
    let listener2 = sinon.spy();
    let listener3 = sinon.spy();
    let listener3Condition = sinon
      .stub()
      .onCall(0)
      .returns(false)
      .onCall(1)
      .returns(false)
      .onCall(2)
      .returns(true);

    service.registerListener(listener1);
    service.registerListener(listener2, 'two');
    service.registerListener(listener3, listener3Condition);

    assert.equal(service.listeners.length, 3);

    // Trigger unknown message
    service.onMessage({ type: 'unknown' });

    assert.ok(listener1.calledOnce);
    assert.ok(listener2.notCalled);
    assert.ok(listener3.notCalled);

    // Trigger two message
    service.onMessage({ type: 'two' });

    assert.ok(listener1.calledTwice);
    assert.ok(listener2.calledOnce);
    assert.ok(listener3.notCalled);

    // Trigger two message
    service.onMessage({ type: 'forTheThree' });

    assert.ok(listener1.calledThrice);
    assert.ok(listener2.calledOnce);
    assert.ok(listener3.calledOnce);
  });

  test('it unregister listeners', function (assert) {
    let service = this.owner.lookup('service:window-message');

    let listener1 = sinon.spy();
    let listener2 = sinon.spy();
    let listener3 = sinon.spy();

    let listener1Unregister = service.registerListener(listener1, '1-conditon');
    let listener2Unregister = service.registerListener(listener2, '2-conditon');
    let listener3Unregister = service.registerListener(listener3, '3-conditon');

    assert.equal(service.listeners.length, 3);

    listener2Unregister();

    assert.deepEqual(service.listeners, [
      {
        callback: listener1,
        condition: '1-conditon'
      },
      {
        callback: listener3,
        condition: '3-conditon'
      }
    ]);

    listener1Unregister();
    listener2Unregister();

    assert.deepEqual(service.listeners, [
      {
        callback: listener3,
        condition: '3-conditon'
      }
    ]);

    listener3Unregister();

    assert.equal(service.listeners.length, 0);
  });
});
