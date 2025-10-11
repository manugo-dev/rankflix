import { Routes, Route } from "react-router";

import { MainLayout } from "@/app/layouts/main-layout";
import { HomePage } from "@/pages/home";
import { MovieDetailPage } from "@/pages/movie-detail";
import { WishlistPage } from "@/pages/wishlist";
import { ROUTES } from "@/shared/routes";

export function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route element={<MainLayout />}>
        <Route path={ROUTES.WISHLIST} element={<WishlistPage />} />
        <Route path={ROUTES.MOVIE_DETAIL} element={<MovieDetailPage />} />
        <Route path="*" element={<div>404 – Page not found</div>} />
      </Route>
    </Routes>
  );
}
