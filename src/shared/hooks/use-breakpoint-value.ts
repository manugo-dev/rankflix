import { BREAKPOINTS_ORDERED, type BreakpointValueObject } from "../config/responsive";
import { useBreakpoints } from "./use-breakpoints";

export function useBreakpointValue<T>(_values: BreakpointValueObject<T>): T | undefined;
export function useBreakpointValue<T>(_values: BreakpointValueObject<T>, _defaultValue: T): T;
export function useBreakpointValue<T>(values: BreakpointValueObject<T>, defaultValue?: T) {
  const current = useBreakpoints();

  if (values[current] !== undefined) return values[current];

  const currentIndex = BREAKPOINTS_ORDERED.indexOf(current);
  for (let index = currentIndex - 1; index >= 0; index--) {
    const key = BREAKPOINTS_ORDERED[index];
    if (values[key] !== undefined) return values[key];
  }

  return defaultValue;
}
