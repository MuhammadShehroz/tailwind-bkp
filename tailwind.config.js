const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans]
      },

      colors: {
        indigo: {
          600: '#392396'
        },

        teal: {
          DEFAULT: '#08dccc',
          dark: '#09C8B9',
          light: '#A8E8E4'
        }
      }
    }
  },

  variants: {
    extend: {}
  },

  plugins: [require('@tailwindcss/forms')]
};
