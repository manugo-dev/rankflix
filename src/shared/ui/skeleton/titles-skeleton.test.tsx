import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TitlesSkeleton } from "./titles-skeleton";

const DEFAULT_PROPS = {};

function renderTitlesSkeleton() {
  return render(<TitlesSkeleton {...DEFAULT_PROPS} />);
}

describe("TitlesSkeleton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("matches the snapshot", () => {
    const { container } = renderTitlesSkeleton();

    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders ten skeleton cards", () => {
    renderTitlesSkeleton();

    const cards = document.querySelectorAll(".titles-skeleton__card");

    expect(cards.length).toBe(10);
  });

  it("renders the outer track container", () => {
    renderTitlesSkeleton();

    const track = document.querySelector(".titles-skeleton__track");

    expect(track).toBeTruthy();
  });
});
