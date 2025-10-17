import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import { App } from "./app/app";
import { i18n } from "./shared/config";

// Dehydrated state from SSR
const dehydratedState = globalThis.__INITIAL_STATE__;
const language = globalThis.__LANGUAGE__;

// eslint-disable-next-line unicorn/prefer-top-level-await
i18n.changeLanguage(language).catch((error) => {
  console.error("Failed to change i18next language:", error);
});

hydrateRoot(
  document.querySelector("#root") as HTMLElement,
  <StrictMode>
    <BrowserRouter>
      <App dehydratedState={dehydratedState} />
    </BrowserRouter>
  </StrictMode>,
);
