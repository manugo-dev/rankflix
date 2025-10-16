import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { Fragment } from "react/jsx-runtime";
import { afterEach, beforeEach, vi } from "vitest";

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

process.env.NODE_ENV = "test";
process.env.VITE_TMDB_API_KEY = "tmdbTestApiKey";
process.env.VITE_TMDB_API_BASE_URL = "http://test.test/api";
process.env.VITE_TMDB_IMAGE_BASE_URL = "http://test.test/image";

vi.mock("framer-motion", async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import("framer-motion")>()),
    AnimatePresence: ({ children }: { children?: ReactNode }) =>
      createElement(Fragment, null, children),
  };
});

class MockResizeObserver {
  private callback: ResizeObserverCallback;
  private static lastInstance: MockResizeObserver | null = null;
  private static _disconnectCount = 0;
  public static get disconnectCount(): number {
    return MockResizeObserver._disconnectCount;
  }
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    MockResizeObserver.lastInstance = this;
  }
  observe(_target: Element): void {
    // noop
  }
  unobserve(_target: Element): void {
    // noop - added to match ResizeObserver prototype
  }
  disconnect(): void {
    MockResizeObserver._disconnectCount += 1;
  }
  //  Manually trigger the resize callback for testing purposes
  static triggerResize(): void {
    MockResizeObserver.lastInstance?.callback(
      [],
      MockResizeObserver.lastInstance as unknown as ResizeObserver,
    );
  }
  static reset(): void {
    MockResizeObserver.lastInstance = null;
    MockResizeObserver._disconnectCount = 0;
  }
}

Object.defineProperty(globalThis, "ResizeObserver", {
  configurable: true,
  value: MockResizeObserver,
  writable: true,
});

Object.defineProperty(globalThis, "matchMedia", {
  value: vi.fn().mockImplementation((query) => ({
    addEventListener: vi.fn(),
    addListener: vi.fn(),
    dispatchEvent: vi.fn(),
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
    removeListener: vi.fn(),
  })),
  writable: true,
});

Object.defineProperty(globalThis, "IntersectionObserver", {
  configurable: true,
  value: vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
  })),
  writable: true,
});
