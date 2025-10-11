import { Outlet } from "react-router";

import { Footer } from "../../widgets/footer";
import { Header } from "../../widgets/header";

export function MainLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
