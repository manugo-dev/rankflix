export default {
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix --max-warnings=0",
    "prettier --write",
    "vitest related --run --passWithNoTests",
  ],
  "*.{scss,css}": ["stylelint --fix", "prettier --write"],
  "*.{json,md,yml,yaml}": ["prettier --write"],
};
