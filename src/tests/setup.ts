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

vi.mock("framer-motion", async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import("framer-motion")>()),
    AnimatePresence: ({ children }: { children?: ReactNode }) =>
      createElement(Fragment, null, children),
  };
});
