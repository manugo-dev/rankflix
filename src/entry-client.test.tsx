import type { DehydratedState } from "@tanstack/react-query";
import { createElement, type JSX } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

type AppModule = typeof import("./app/app");
type AppProps = Parameters<AppModule["App"]>[0];
type AppComponent = (_props: AppProps) => JSX.Element;
type HydrateRootFn = (typeof import("react-dom/client"))["hydrateRoot"];

const hydrateRootFn = vi.fn<HydrateRootFn>();
const APP_COMPONENT_MOCK = vi.fn<AppComponent>(() => {
  return createElement("div");
});

vi.mock("react-dom/client", () => ({
  hydrateRoot: hydrateRootFn,
}));

vi.mock("./app/app", () => ({
  App: APP_COMPONENT_MOCK,
}));

const createInitialStateAccessor = () => {
  return globalThis as typeof globalThis & {
    __INITIAL_STATE__?: DehydratedState;
  };
};

describe("entry-client", () => {
  beforeEach(async () => {
    await vi.resetModules();
    vi.clearAllMocks();
    document.body.innerHTML = "";
    const globalWithInitialState = createInitialStateAccessor();
    delete globalWithInitialState.__INITIAL_STATE__;
  });

  it("should hydrate application using root element", async () => {
    const rootElement = document.createElement("div");
    rootElement.setAttribute("id", "root");
    document.body.append(rootElement);

    await import("./entry-client");

    expect(hydrateRootFn).toHaveBeenCalledTimes(1);
    expect(hydrateRootFn).toHaveBeenCalledWith(rootElement, expect.anything());
  });

  it("should pass dehydrated state from global scope to App component", async () => {
    const rootElement = document.createElement("div");
    rootElement.setAttribute("id", "root");
    document.body.append(rootElement);

    const dehydratedState: DehydratedState = {
      mutations: [],
      queries: [],
    };
    const globalWithInitialState = createInitialStateAccessor();
    globalWithInitialState.__INITIAL_STATE__ = dehydratedState;

    await import("./entry-client");

    expect(hydrateRootFn).toHaveBeenCalledTimes(1);
    const hydrateRootCall = hydrateRootFn.mock.calls[0];

    if (!hydrateRootCall) {
      throw new Error("hydrateRoot was not called");
    }

    const [, reactElement] = hydrateRootCall;
    const strictModeElement = reactElement as JSX.Element;
    const browserRouterElement = strictModeElement.props.children as JSX.Element;
    const appElement = browserRouterElement.props.children as JSX.Element;

    expect(appElement.type).toBe(APP_COMPONENT_MOCK);
    expect(appElement.props.dehydratedState).toBe(dehydratedState);
  });
});
