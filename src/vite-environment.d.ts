/// <reference types="vite/client" />

declare global {
  interface Window {
    __INITIAL_STATE__?: Record<string, unknown>;
  }
}
