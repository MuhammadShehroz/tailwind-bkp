const scrollToErrorField = (
  containerSelector,
  fieldSelector,
  isWithinModal
) => {
  fieldSelector = fieldSelector || 'form .error';

  isWithinModal = isWithinModal || !!document.querySelector('.tw-modal');

  containerSelector =
    containerSelector || (isWithinModal ? '.tw-modal' : '#page');
  let fieldElement = document.querySelector(
    `${containerSelector} ${fieldSelector}`
  );

  fieldElement?.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });
};

export { scrollToErrorField };
