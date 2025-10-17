import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Footer } from "./footer-ui";

describe("Footer", () => {
  it("renders footer element with expected text", () => {
    render(<Footer />);
    const element = screen.getByText(/#footer.crafted#/i);
    expect(element.tagName.toLowerCase()).toBe("footer");
  });
});
