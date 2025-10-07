import { Link } from "react-router";

export const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="rf-shell">
    <header className="rf-header">
      <Link to="/" className="rf-brand">
        Rankflix
      </Link>
      <nav className="rf-nav">
        <Link to="/">Home</Link>
        <Link to="/wishlist">Wishlist</Link>
      </nav>
    </header>
    <main className="rf-main">{children}</main>
  </div>
);
