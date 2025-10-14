import { Route, Routes } from "react-router";

import { MainLayout } from "@/app/layouts/main-layout";
import { HomePage } from "@/pages/home";
import { MovieDetailPage } from "@/pages/movie-detail";
import { NotFoundPage } from "@/pages/not-found";
import { WatchlistPage } from "@/pages/watchlist";
import { ROUTES } from "@/shared/routes";

export function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route element={<MainLayout />}>
        <Route path={ROUTES.WATCHLIST} element={<WatchlistPage />} />
        <Route path={ROUTES.MOVIE_DETAIL} element={<MovieDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
