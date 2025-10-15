import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { HeroSlider } from "./hero-slider";

const DEFAULT_PROPS = {};

function renderHeroSlider(children: ReactNode) {
  return render(<HeroSlider {...DEFAULT_PROPS}>{children}</HeroSlider>);
}

describe("HeroSlider", () => {
  it("renders the first slide initially", () => {
    renderHeroSlider([<div key="a">Slide A</div>, <div key="b">Slide B</div>]);
    expect(screen.getByText("Slide A")).toBeTruthy();
  });

  it("advances to next slide when next control clicked", async () => {
    const user = userEvent.setup();
    const { container } = renderHeroSlider([
      <div key="a">Slide A</div>,
      <div key="b">Slide B</div>,
    ]);

    const nextButton = container.querySelector(".hero-slider__control--next") as HTMLButtonElement;
    await user.click(nextButton);
    expect(await screen.findByText("Slide B")).toBeTruthy();
  });

  it("moves to previous slide when previous control clicked", async () => {
    const user = userEvent.setup();
    const { container } = renderHeroSlider([
      <div key="a">Slide A</div>,
      <div key="b">Slide B</div>,
    ]);

    const previousButton = container.querySelector(
      ".hero-slider__control--prev",
    ) as HTMLButtonElement;

    await user.click(previousButton);

    expect(await screen.findByText("Slide B")).toBeTruthy();
  });

  it("autoplays to next slide after interval when autoPlay is true", async () => {
    render(
      <HeroSlider autoPlay interval={50}>
        <div>Slide 1</div>
        <div>Slide 2</div>
      </HeroSlider>,
    );

    expect(screen.getByText("Slide 1")).toBeTruthy();
    await waitFor(() => expect(screen.getByText("Slide 2")).toBeTruthy());
  });

  it("does not autoplay when autoPlay is false", () => {
    vi.useFakeTimers();

    render(
      <HeroSlider autoPlay={false} interval={10}>
        <div>Slide 1</div>
        <div>Slide 2</div>
      </HeroSlider>,
    );

    expect(screen.getByText("Slide 1")).toBeTruthy();
    vi.runOnlyPendingTimers();
    expect(screen.getByText("Slide 1")).toBeTruthy();
    vi.useRealTimers();
  });
});
