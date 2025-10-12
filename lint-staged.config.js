export default {
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix --max-warnings=0",
    "prettier --write",
    "vitest related --run --passWithNoTests",
  ],
  "*.{json,md,yml,yaml}": ["prettier --write"],
  "*.{scss,css}": ["prettier --write", "stylelint --fix"],
};
