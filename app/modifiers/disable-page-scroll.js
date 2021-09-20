import { modifier } from 'ember-modifier';

export default modifier((element, [disable, tabletAndMobileOnly]) => {
  let { overflow } = document.querySelector('body').style;

  if (disable && (tabletAndMobileOnly ? window.innerWidth <= 768 : true)) {
    document.querySelector('body').style.overflow = 'hidden';
  } else {
    document.querySelector('body').style.overflow = overflow;
  }

  return () => (document.querySelector('body').style.overflow = overflow);
});
