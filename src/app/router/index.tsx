import { Routes, Route } from "react-router";

import { HomePage } from "@/pages/home";
import { WishlistPage } from "@/pages/wishlist";
import { ROUTES } from "@/shared/config/router";

export function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.WISHLIST} element={<WishlistPage />} />
      <Route path="*" element={<div>404 – Page not found</div>} />
    </Routes>
  );
}
