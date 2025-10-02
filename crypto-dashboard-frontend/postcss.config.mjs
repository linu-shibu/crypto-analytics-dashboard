export default {
  plugins: {
    "postcss-nesting": {}, // 👈 nesting must come first
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};
