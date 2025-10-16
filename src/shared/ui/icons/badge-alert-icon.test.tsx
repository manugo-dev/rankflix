import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { BadgeAlertIcon } from "./badge-alert-icon";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("BadgeAlertIcon", () => {
  it("matches the snapshot", () => {
    const { container } = render(<BadgeAlertIcon />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders an svg with default size", () => {
    const { container } = render(<BadgeAlertIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg).toHaveAttribute("width", "28");
    expect(svg).toHaveAttribute("height", "28");
  });

  it("renders an svg with other size", () => {
    const { container } = render(<BadgeAlertIcon size={32} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg).toHaveAttribute("width", "32");
    expect(svg).toHaveAttribute("height", "32");
  });
});
