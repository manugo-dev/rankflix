import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";

import { App } from "./app";

export interface RenderResult {
  html: string;
}

export const render = (url: string): RenderResult => {
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );

  return {
    html,
  };
};

export type RenderFunction = typeof render;
