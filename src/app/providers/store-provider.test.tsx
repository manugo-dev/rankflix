import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StoreProvider } from "./store-provider";

describe("StoreProvider", () => {
  it("renders its children", () => {
    render(
      <StoreProvider>
        <div data-testid="child">ok</div>
      </StoreProvider>,
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
