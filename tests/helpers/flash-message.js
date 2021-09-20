import FlashObject from 'ember-cli-flash/flash/object';

FlashObject.reopen({ init() {} });

export const flashMessagesMock = (items) => ({
  clearMessages() {
    items.push({
      functionName: 'flash-messages:clearMessages',
      arguments: [...arguments]
    });
  },

  add() {
    items.push({
      functionName: 'flash-messages:add',
      arguments: [...arguments]
    });
  },

  success() {
    items.push({
      functionName: 'flash-messages:add',
      arguments: [...arguments]
    });
  }
});
