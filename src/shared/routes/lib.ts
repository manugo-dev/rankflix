import { ROUTES } from "./constants";

export const getRouteLink: Record<keyof typeof ROUTES, (..._params: string[]) => string> = {
  HOME: () => ROUTES.HOME,
  MOVIE_DETAIL: (movieId: string) => ROUTES.MOVIE_DETAIL.replace(":movieId", movieId),
  WISHLIST: () => ROUTES.WISHLIST,
};
