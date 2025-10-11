import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import { App } from "./app/app";

// Dehydrated state from SSR
const dehydratedState = globalThis.__INITIAL_STATE__;

hydrateRoot(
  document.querySelector("#root") as HTMLElement,
  <StrictMode>
    <BrowserRouter>
      <App dehydratedState={dehydratedState} />
    </BrowserRouter>
  </StrictMode>,
);
