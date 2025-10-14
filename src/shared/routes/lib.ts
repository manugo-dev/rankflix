import { ROUTES } from "./constants";

export const getRouteLink: Record<keyof typeof ROUTES, (..._params: string[]) => string> = {
  ERROR: () => ROUTES.ERROR,
  HOME: () => ROUTES.HOME,
  MOVIE_DETAIL: (movieId: string) => ROUTES.MOVIE_DETAIL.replace(":movieId", movieId),
  WATCHLIST: () => ROUTES.WATCHLIST,
};
