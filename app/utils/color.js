import ColorThief from 'colorthief';

const rgbToHex = (r, g, b) =>
  `#${[r, g, b]
    .map((x) => {
      let hex = x.toString(16);
      return hex.length === 1 ? `0${hex}` : hex;
    })
    .join('')}`;

const getPaletteFromImage = (img) =>
  new ColorThief().getPalette(img).map((colors) => rgbToHex(...colors));

const getPaletteFromURL = (url) =>
  new Promise((resolve, reject) => {
    let image = new Image();
    image.onload = ({ target }) => resolve(getPaletteFromImage(target));
    image.onerror = reject;
    image.crossOrigin = 'Anonymous';
    image.src = url;
  });

export { rgbToHex, getPaletteFromImage, getPaletteFromURL };
