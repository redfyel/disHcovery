import { Link } from "react-router-dom";
import Search from "../search-box/Search";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      {/* Logo */}
      <Link to="/" className="logo">
        <img
          src="https://media.istockphoto.com/id/638708254/vector/cooking-process-vector-illustration-flipping-asian-food-in-a-pan.jpg?s=612x612&w=0&k=20&c=5CYIPce69zbyPaXpytKks_xLYIBdr3XN_RzDAQcn2Yw="
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
