import smoothscroll from 'smoothscroll-polyfill';

export function initialize(/* application */) {
  smoothscroll.polyfill();
}

export default {
  initialize
};
