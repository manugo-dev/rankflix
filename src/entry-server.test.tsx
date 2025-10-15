import type { DehydratedState, QueryClient } from "@tanstack/react-query";
import { createElement, type JSX } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

type PrefetchRouteDataFunction = (typeof import("@/shared/lib/prefetch"))["prefetchRouteData"];
type DehydrateFunction = (typeof import("@tanstack/react-query"))["dehydrate"];
type RenderToStringFunction = (typeof import("react-dom/server"))["renderToString"];
type AppModule = typeof import("./app/app");
type AppProps = Parameters<AppModule["App"]>[0];
type AppComponent = (_props: AppProps) => JSX.Element;
type CreateQueryClientFunction = () => QueryClient;

const DEFAULT_DEHYDRATED_STATE: DehydratedState = {
  mutations: [],
  queries: [],
};
const DEFAULT_HTML = "<div>SSR</div>";

const prefetchRouteDataFn = vi.fn<PrefetchRouteDataFunction>(async () => {});
const dehydrateFn = vi.fn<DehydrateFunction>(() => DEFAULT_DEHYDRATED_STATE);
const renderToStringFn = vi.fn<RenderToStringFunction>(() => DEFAULT_HTML);
const APP_COMPONENT_MOCK = vi.fn<AppComponent>(() => {
  return createElement("div");
});
const QUERY_CLIENT_FACTORY_FN = vi.fn<CreateQueryClientFunction>(() => {
  return { id: Symbol("query-client") } as unknown as QueryClient;
});

vi.mock("@/shared/lib/prefetch", () => ({
  prefetchRouteData: prefetchRouteDataFn,
}));

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();

  return {
    ...actual,
    dehydrate: dehydrateFn,
  };
});

vi.mock("react-dom/server", () => ({
  renderToString: renderToStringFn,
}));

vi.mock("./app/app", () => ({
  App: APP_COMPONENT_MOCK,
}));

vi.mock("./pages/ssr", () => ({}));

vi.mock("@/shared/config", () => ({
  createQueryClient: QUERY_CLIENT_FACTORY_FN,
}));

describe("entry-server render", () => {
  beforeEach(async () => {
    await vi.resetModules();
    vi.clearAllMocks();
    prefetchRouteDataFn.mockImplementation(async () => {});
    dehydrateFn.mockImplementation(() => DEFAULT_DEHYDRATED_STATE);
    renderToStringFn.mockImplementation(() => DEFAULT_HTML);
    QUERY_CLIENT_FACTORY_FN.mockImplementation(() => {
      return { id: Symbol("query-client") } as unknown as QueryClient;
    });
  });

  it("should prefetch route data and return rendered markup", async () => {
    const currentUrl = "/movies";
    const queryClient = { id: Symbol("query-client") } as unknown as QueryClient;
    const dehydratedState: DehydratedState = {
      mutations: [],
      queries: [],
    };
    const htmlMarkup = "<section>SSR</section>";

    QUERY_CLIENT_FACTORY_FN.mockReturnValueOnce(queryClient);
    dehydrateFn.mockReturnValueOnce(dehydratedState);
    renderToStringFn.mockReturnValueOnce(htmlMarkup);

    const { render } = await import("./entry-server");
    const result = await render(currentUrl);

    expect(QUERY_CLIENT_FACTORY_FN).toHaveBeenCalledTimes(1);
    expect(prefetchRouteDataFn).toHaveBeenCalledWith(queryClient, currentUrl);
    expect(dehydrateFn).toHaveBeenCalledWith(queryClient);
    expect(renderToStringFn).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      dehydrated: dehydratedState,
      html: htmlMarkup,
    });
  });

  it("should render application within StaticRouter using current url", async () => {
    const currentUrl = "/watchlist";
    const queryClient = { id: Symbol("query-client") } as unknown as QueryClient;
    const dehydratedState: DehydratedState = {
      mutations: [],
      queries: [],
    };

    QUERY_CLIENT_FACTORY_FN.mockReturnValueOnce(queryClient);
    dehydrateFn.mockReturnValueOnce(dehydratedState);

    const { render } = await import("./entry-server");
    await render(currentUrl);

    const renderArguments = renderToStringFn.mock.calls[0];

    if (!renderArguments) {
      throw new Error("renderToString was not called");
    }

    const [reactElement] = renderArguments;
    const strictModeElement = reactElement as JSX.Element;
    const staticRouterElement = strictModeElement.props.children as JSX.Element;
    const appElement = staticRouterElement.props.children as JSX.Element;

    expect(staticRouterElement.props.location).toBe(currentUrl);
    expect(appElement.type).toBe(APP_COMPONENT_MOCK);
    expect(appElement.props.dehydratedState).toBe(dehydratedState);
  });
});
