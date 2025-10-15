import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button, type ButtonProps } from "./button";

const DEFAULT_ON_CLICK_FN = vi.fn();

const DEFAULT_PROPS: ButtonProps = {
  onClick: DEFAULT_ON_CLICK_FN,
  variant: "primary",
};

function renderButton(props: Partial<ButtonProps> = {}) {
  return render(
    <Button {...DEFAULT_PROPS} {...props}>
      Test Button
    </Button>,
  );
}

describe("Button", () => {
  it("renders with the provided children text", () => {
    renderButton();
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Test Button");
  });

  it("applies primary variant class by default", () => {
    renderButton();
    const button = screen.getByRole("button");
    expect(button.className).toContain("button--primary");
  });

  it("applies danger variant class when variant is danger", () => {
    renderButton({ variant: "danger" });
    const button = screen.getByRole("button");
    expect(button.className).toContain("button--danger");
  });

  it("forwards id attribute to the underlying button element", () => {
    renderButton({ id: "test-id" });
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("id", "test-id");
  });

  it("forwards title attribute to the underlying button element", () => {
    renderButton({ title: "test-title" });
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("title", "test-title");
  });

  it("applies custom className when provided", () => {
    renderButton({ className: "my-custom-class" });
    const button = screen.getByRole("button");
    expect(button.className).toContain("my-custom-class");
  });

  it("keeps internal button class when custom className provided", () => {
    renderButton({ className: "my-custom-class" });
    const button = screen.getByRole("button");
    expect(button.className).toContain("button");
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    renderButton();
    const button = screen.getByRole("button");
    await user.click(button);
    expect(DEFAULT_ON_CLICK_FN).toHaveBeenCalledTimes(1);
  });

  it("uses provided type attribute when specified", () => {
    renderButton({ type: "button" });
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "button");
  });
});
