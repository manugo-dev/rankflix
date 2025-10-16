import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useKeyboardShortcuts } from "./use-keyboard-shortcuts";

const createElementReference = () => {
  const element = document.createElement("div");
  document.body.append(element);
  return { current: element };
};

describe("useKeyboardShortcuts", () => {
  it("does nothing when disabled", () => {
    const reference = createElementReference();
    const handler = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        containerRef: reference,
        enabled: false,
        keys: { a: { handler } },
      }),
    );

    const event = new KeyboardEvent("keydown", { key: "a" });
    reference.current.dispatchEvent(event);
    expect(handler).not.toHaveBeenCalled();
  });

  it("does nothing if containerRef.current is null", () => {
    const { result } = renderHook(() =>
      useKeyboardShortcuts({
        containerRef: { current: null },
        keys: { a: { handler: vi.fn() } },
      }),
    );
    expect(result.current).toBeUndefined();
  });

  it("does nothing if key is not configured", () => {
    const reference = createElementReference();
    const { result } = renderHook(() =>
      useKeyboardShortcuts({
        containerRef: reference,
        keys: { a: { handler: vi.fn() } },
      }),
    );
    const event = new KeyboardEvent("keydown", { key: "b" });
    reference.current.dispatchEvent(event);
    expect(result.current).toBeUndefined();
  });

  it("calls handler when key matches", () => {
    const reference = createElementReference();
    const handler = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        containerRef: reference,
        keys: { a: { handler } },
      }),
    );

    const event = new KeyboardEvent("keydown", { key: "a" });
    reference.current.dispatchEvent(event);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("respects preventDefault and stopPropagation", () => {
    const reference = createElementReference();
    const handler = vi.fn();
    const preventDefault = vi.fn();
    const stopPropagation = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        containerRef: reference,
        keys: {
          b: {
            handler,
            preventDefault: true,
            stopPropagation: true,
          },
        },
      }),
    );

    const event = new KeyboardEvent("keydown", { key: "b" });
    Object.defineProperties(event, {
      preventDefault: { value: preventDefault },
      stopPropagation: { value: stopPropagation },
    });

    reference.current.dispatchEvent(event);

    expect(preventDefault).toHaveBeenCalled();
    expect(stopPropagation).toHaveBeenCalled();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("throttles repeated calls when throttle is true", async () => {
    vi.useFakeTimers();
    const reference = createElementReference();
    const handler = vi.fn();

    renderHook(() =>
      useKeyboardShortcuts({
        containerRef: reference,
        keys: { c: { handler, throttle: true } },
        throttleMs: 100,
      }),
    );

    const event = new KeyboardEvent("keydown", { key: "c" });
    reference.current.dispatchEvent(event);
    reference.current.dispatchEvent(event);
    expect(handler).toHaveBeenCalledTimes(1);

    // advance time beyond throttle window
    act(() => vi.advanceTimersByTime(150));
    reference.current.dispatchEvent(event);
    expect(handler).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });

  it("cleans up event listener on unmount", () => {
    const reference = createElementReference();
    const addSpy = vi.spyOn(reference.current, "addEventListener");
    const removeSpy = vi.spyOn(reference.current, "removeEventListener");

    const { unmount } = renderHook(() =>
      useKeyboardShortcuts({
        containerRef: reference,
        keys: { x: { handler: () => {} } },
      }),
    );

    expect(addSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
    unmount();
    expect(removeSpy).toHaveBeenCalledWith("keydown", expect.any(Function));

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
