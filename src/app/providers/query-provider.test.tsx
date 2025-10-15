import type { DehydratedState } from "@tanstack/react-query";
import * as reactQuery from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from "vitest";

import { QueryProvider } from "./query-provider";

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();
  return {
    ...actual,
    hydrate: vi.fn(),
  } as unknown;
});

describe("QueryProvider", () => {
  beforeEach(() => {
    Reflect.deleteProperty(globalThis, "__TANSTACK_QUERY_CLIENT__");
  });

  afterEach(() => {
    if ("_savedWindow" in globalThis) {
      // @ts-expect-error saved window may be unknown
      globalThis.window = globalThis["_savedWindow"];
      Reflect.deleteProperty(globalThis, "_savedWindow");
    }
    Reflect.deleteProperty(globalThis, "__TANSTACK_QUERY_CLIENT__");
  });

  it("renders children and sets global query client without hydrating when no state", () => {
    const hydrateMock = reactQuery.hydrate as unknown as Mock;

    render(
      <QueryProvider>
        <div data-testid="child">child</div>
      </QueryProvider>,
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    const client = globalThis.__TANSTACK_QUERY_CLIENT__;
    expect(client).toBeDefined();
    expect(hydrateMock).not.toHaveBeenCalled();
  });

  it("calls hydrate when dehydratedState provided and window exists", () => {
    const hydrateMock = reactQuery.hydrate as unknown as Mock;

    const dehydratedState: DehydratedState = {
      mutations: [],
      queries: [],
    };

    render(
      <QueryProvider dehydratedState={dehydratedState}>
        <div data-testid="child">child</div>
      </QueryProvider>,
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();

    const client = globalThis.__TANSTACK_QUERY_CLIENT__;
    expect(client).toBeDefined();
    expect(hydrateMock).toHaveBeenCalledWith(client, dehydratedState);
  });
});
