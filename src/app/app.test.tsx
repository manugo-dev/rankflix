import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import App from ".";

describe("App", () => {
  it("renders the React logo", () => {
    render(<App />);
    const logo = screen.getByAltText("React logo");
    expect(logo).toBeInTheDocument();
  });

  it("renders the main heading", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /Vite \+ React/i })).toBeInTheDocument();
  });
});
