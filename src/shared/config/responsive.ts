export const BREAKPOINTS = {
  lg: 1280,
  md: 1024,
  sm: 768,
  xl: 1440,
  xs: 640,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;
export type BreakpointValueObject<T> = Partial<Record<Breakpoint, T>>;

export const BREAKPOINTS_ORDERED = Object.entries(BREAKPOINTS)
  .toSorted(([_keyA, a], [_keyB, b]) => a - b)
  .map(([key]) => key) as Breakpoint[];

export const DEFAULT_CAROUSEL_ITEMS_PER_PAGE: BreakpointValueObject<number> = {
  md: 4,
  sm: 3,
  xs: 1,
};
