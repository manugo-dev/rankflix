import { ROUTES } from "./constants";

export const getRouteLink: Record<keyof typeof ROUTES, (..._params: string[]) => string> = {
  HOME: () => ROUTES.HOME,
  WISHLIST: () => ROUTES.WISHLIST,
  MOVIE_DETAIL: (movieId: string) => ROUTES.MOVIE_DETAIL.replace(":movieId", movieId),
};
