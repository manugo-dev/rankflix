import { BREAKPOINTS_ORDER, type BreakpointValueObject } from "../config/responsive";
import { useBreakpoint } from "./use-breakpoints";

export function useBreakpointValue<T>(_values: BreakpointValueObject<T>): T | undefined;
export function useBreakpointValue<T>(_values: BreakpointValueObject<T>, _defaultValue: T): T;
export function useBreakpointValue<T>(values: BreakpointValueObject<T>, defaultValue?: T) {
  const current = useBreakpoint();

  if (values[current] !== undefined) return values[current];

  const currentIndex = BREAKPOINTS_ORDER.indexOf(current);
  for (let index = currentIndex - 1; index >= 0; index--) {
    const key = BREAKPOINTS_ORDER[index];
    if (values[key] !== undefined) return values[key];
  }

  return defaultValue;
}
