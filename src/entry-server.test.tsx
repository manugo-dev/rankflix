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

const APP_COMPONENT_MOCK = vi.fn<AppComponent>(() => {
  return createElement("div");
});

const prefetchRouteDataFn = vi.fn<PrefetchRouteDataFunction>(async () => {});
const dehydrateFn = vi.fn<DehydrateFunction>(() => DEFAULT_DEHYDRATED_STATE);
const renderToStringFn = vi.fn<RenderToStringFunction>(() => DEFAULT_HTML);
const queryClientFactoryFn = vi.fn<CreateQueryClientFunction>(() => {
  return { id: Symbol("query-client") } as unknown as QueryClient;
});

vi.mock("./app/app", () => ({
  App: APP_COMPONENT_MOCK,
}));

vi.mock("@/shared/lib/prefetch", async (importActual) => ({
  ...(await importActual<typeof import("@/shared/lib/prefetch")>()),
  prefetchRouteData: prefetchRouteDataFn,
}));

vi.mock("@tanstack/react-query", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@tanstack/react-query")>()),
  dehydrate: dehydrateFn,
}));

vi.mock("@/shared/config", async (importActual) => ({
  ...(await importActual<typeof import("@/shared/config")>()),
  createQueryClient: queryClientFactoryFn,
}));

vi.mock("react-dom/server", () => ({
  renderToString: renderToStringFn,
}));

describe("entry-server render", () => {
  beforeEach(async () => {
    await vi.resetModules();
    vi.clearAllMocks();
    prefetchRouteDataFn.mockImplementation(async () => {});
    dehydrateFn.mockImplementation(() => DEFAULT_DEHYDRATED_STATE);
    renderToStringFn.mockImplementation(() => DEFAULT_HTML);
    queryClientFactoryFn.mockImplementation(() => {
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
    queryClientFactoryFn.mockReturnValueOnce(queryClient);
    dehydrateFn.mockReturnValueOnce(dehydratedState);
    renderToStringFn.mockReturnValueOnce(htmlMarkup);

    const { render } = await import("./entry-server");
    const result = await render(currentUrl);
    expect(queryClientFactoryFn).toHaveBeenCalledTimes(1);
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

    queryClientFactoryFn.mockReturnValueOnce(queryClient);
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
