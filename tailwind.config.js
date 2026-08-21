/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './js/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Arial Rounded MT Bold', 'Trebuchet MS', 'Arial', 'sans-serif']
      }
    }
  },
  plugins: []
};
