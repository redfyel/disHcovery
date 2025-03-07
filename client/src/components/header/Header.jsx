import { Link } from "react-router-dom";
import Search from "../search-box/Search";
import Explore from "../explore/Explore"; 
import logo from "../../assets/images/logoo.png";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <Link to="/" className="logo">
        <img src={logo} alt="disHcovery Logo" />
      </Link>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Explore /> {/* Modular Explore Component */}
        <Link to="/saved">Saved</Link>
        <Link to="/recipes">Recipes</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>
      <Search />
    </header>
  );
}

export default Header;
