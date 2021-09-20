import { modifier } from 'ember-modifier';

const defaultConfig = {
  offsetTop: 0,
  offsetLeft: 0,
  includeNavbarHeight: true,
  behavior: 'smooth'
};

export default modifier(function scrollTo(element, params, hash) {
  let options = { ...defaultConfig, ...hash };

  let { offsetTop, offsetLeft, includeNavbarHeight } = options;
  let additionalOffset = includeNavbarHeight
    ? document.getElementById('app-nav').clientHeight
    : 0;

  window.scrollTo({
    top: element.offsetTop - (offsetTop + additionalOffset),
    left: element.offsetLeft - offsetLeft,
    behavior: options.behavior
  });
});
