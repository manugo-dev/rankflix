import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TitlesSkeleton } from "./titles-skeleton";

const DEFAULT_PROPS = {};

describe("TitlesSkeleton", () => {
  it("matches the snapshot", () => {
    const { container } = render(<TitlesSkeleton {...DEFAULT_PROPS} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders ten skeleton cards", () => {
    render(<TitlesSkeleton {...DEFAULT_PROPS} />);
    const cards = document.querySelectorAll(".titles-skeleton__card");
    expect(cards.length).toBe(10);
  });

  it("renders the outer track container", () => {
    render(<TitlesSkeleton {...DEFAULT_PROPS} />);
    const track = document.querySelector(".titles-skeleton__track");
    expect(track).toBeTruthy();
  });
});
