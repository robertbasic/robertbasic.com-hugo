module.exports = {
  purge: {
      content: ['themes/robertbasic.com/layouts/**/*.html'],
      options: {
        safelist: ['filename', 'highlight', 'block'],
      }
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}
