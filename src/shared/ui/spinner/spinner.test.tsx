import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Spinner } from "./spinner";

const DEFAULT_PROPS = {};

function renderSpinner() {
  return render(<Spinner {...DEFAULT_PROPS} />);
}

describe("Spinner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("matches the snapshot", () => {
    const { container } = renderSpinner();

    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders the expected DOM structure", () => {
    renderSpinner();

    const outer = screen.queryByRole("status") ?? document.querySelector(".spinner");

    expect(outer).toBeTruthy();
    expect(document.querySelector(".spinner .eye")).toBeTruthy();
    expect(document.querySelector(".spinner .halo")).toBeTruthy();
  });
});
