import Component from '@glimmer/component';
import { action } from '@ember/object';
export default class ColorPaletteComponent extends Component {
  static primaryColors = ['#151515', '#FEFEFE'];

  static fallbackColors = [
    '#20E684',
    '#8B17D0',
    '#344BFF',
    '#D2FF20',
    '#FF8A00',
    '#FA386F',
    '#603814'
  ];

  get defaultColor() {
    return this.args.defaultColor || '#354656';
  }

  get colors() {
    let colors = (this.args.colors || this.constructor.fallbackColors).slice(
      0,
      7
    );
    colors =
      colors.length < 7
        ? [
            ...colors,
            ...this.constructor.fallbackColors.slice(0, 7 - (colors.length - 1))
          ]
        : colors;
    return [...colors, ...this.constructor.primaryColors, this.defaultColor];
  }

  @action
  onClickColor(color) {
    this.args.onClickColor(color);
  }
}
