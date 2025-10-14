import { type RefObject, useEffect, useRef } from "react";

type KeyHandler = (_event: KeyboardEvent) => void;

interface KeyConfig {
  handler: KeyHandler;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  throttle?: boolean;
}

interface UseKeyboardShortcutsOptions {
  containerRef: RefObject<HTMLElement | null>;
  enabled?: boolean;
  keys: Record<string, KeyConfig>;
  throttleMs?: number;
}

export function useKeyboardShortcuts({
  containerRef,
  enabled = true,
  keys,
  throttleMs = 50,
}: UseKeyboardShortcutsOptions) {
  const lastExecutionTimeReference = useRef<Record<string, number>>({});

  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const config = keys[event.key];
      if (!config) return;

      const now = Date.now();
      const lastTime = lastExecutionTimeReference.current[event.key] || 0;
      const shouldThrottle = config.throttle && now - lastTime < throttleMs;

      if (shouldThrottle) return;

      if (config.preventDefault) {
        event.preventDefault();
      }

      if (config.stopPropagation) {
        event.stopPropagation();
      }

      if (config.throttle) {
        lastExecutionTimeReference.current[event.key] = now;
      }

      config.handler(event);
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [containerRef, keys, throttleMs, enabled]);
}
