module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
  },
  future: {
    removeDeprecated: process.env.NODE_ENV === 'production',
  },
}
