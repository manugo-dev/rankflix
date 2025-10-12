/** @type {import("stylelint").Config} */
export default {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-standard-scss",
    "stylelint-config-sass-guidelines",
    "stylelint-config-idiomatic-order",
  ],
  plugins: ["stylelint-scss", "stylelint-order"],
  rules: {
    "@stylistic/string-quotes": "double",

    // Custom BEM class naming pattern validation
    "selector-class-pattern": [
      "^[a-z]([-]?[a-z0-9]+)*(__[a-z0-9]([-]?[a-z0-9]+)*)?(--[a-z0-9]([-]?[a-z0-9]+)*)?$",
      {
        message: function expected(selectorValue) {
          return `Expected class selector "${selectorValue}" to match BEM CSS pattern`;
        },
        resolveNestedSelectors: true,
      },
    ],
  },
};
