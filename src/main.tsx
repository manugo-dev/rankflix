import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./app";

import "./styles/main.scss";

createRoot(document.querySelector("#root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
