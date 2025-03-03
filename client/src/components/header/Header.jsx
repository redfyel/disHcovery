import { Link } from "react-router-dom";
import Search from "../search-box/Search";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      {/* Logo */}
      <Link to="/" className="logo">
        <img
          src="https://static.gamberorosso.it/dishcovery-logo.jpg"
          alt="Dishcovery Logo"
        />
      </Link>

      {/* Navigation Menu */}
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/explore">Explore</Link>
        <Link to="/saved">Saved</Link>
        <Link to="/recipes">Recipes</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>

      {/* Search Bar */}
      <Search />
    </header>
  );
}

export default Header;
