import { modifier } from 'ember-modifier';
import podNames from 'ember-component-css/pod-names';

export default modifier(function componentClass(element, [path]) {
  element.classList.add(podNames[path]);
});
