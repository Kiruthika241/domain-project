// postcss.config.cjs
module.exports = {
  plugins: {
    // use the dedicated PostCSS bridge plugin for Tailwind
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
