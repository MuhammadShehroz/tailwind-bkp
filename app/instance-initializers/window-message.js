const FRAME_SOURCES = [
  '//localhost:4200',
  '//app.blinkstage.com',
  '//app.blinksale.net',
  '//app.blinksale.com'
];

export function initialize(appInstance) {
  let windowMessageService = appInstance.lookup('service:window-message');

  window.addEventListener('message', (e) => {
    if (e.data && FRAME_SOURCES.includes(e.origin.replace(/^[^:/]*:/, ''))) {
      let message = null;
      try {
        message = JSON.parse(e.data);
      } catch (e) {
        // swallow error
      }

      if (message?.type) {
        windowMessageService.onMessage(message);
      }
    }
  });
}

export default {
  initialize
};
