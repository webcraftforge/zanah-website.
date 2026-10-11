
import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { scrollToTop } from "../useSmoothScroll";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const close = () => setMenuOpen(false);

  // Clicking the logo / Home while already on the home page scrolls back up.
  const goHome = () => {
    close();
    if (pathname === "/") scrollToTop();
  };

  return (
    <header className="navbar">
      <Link className="navbar__logo" to="/" aria-label="ZANAH home" onClick={goHome}>
        ZANAH<span>.</span>
      </Link>

      <nav className={`navbar__links ${menuOpen ? "is-open" : ""}`}>
        <NavLink to="/" end onClick={goHome}>Home</NavLink>
        <NavLink to="/shop" onClick={close}>Shop</NavLink>
        <a href="#contact" onClick={close}>Contact</a>
      </nav>

      <button
        className="navbar__menu"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
      </button>
    </header>
  );
}