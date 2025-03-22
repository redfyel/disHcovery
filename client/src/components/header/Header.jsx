import { Link } from "react-router-dom";
import Search from "../search-box/Search";
import Explore from "../explore/Explore";
import logo from "../../assets/images/logo_og.png";
import { userLoginContext } from "../../contexts/UserLoginContext";
import "./Header.css";
import { useContext, useState } from "react";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";

function Header() {
  const { loginStatus, onLogin, onLogout } = useContext(userLoginContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <Link to="/" className="logo">
        <img src={logo} alt="disHcovery Logo" />
      </Link>

      {/* Hamburger Menu Icon (Visible on smaller screens) */}
      <button className="menu-toggle" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <nav className={`nav-links ${menuOpen ? "nav-active" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Explore onClick={() => setMenuOpen(false)} />{" "}
        {/* Modular Explore Component */}
        <Link to="/saved" onClick={() => setMenuOpen(false)}>
          Saved
        </Link>
        <Link to="/recipes" onClick={() => setMenuOpen(false)}>
          Recipes
        </Link>

        {loginStatus ? (
          <>
            <Link to="/login" onClick={() => { onLogout(); setMenuOpen(false); }}>
              Logout
            </Link>
            {/* User Icon Link to Dashboard */}
            <Link to="/dashboard" className="user-icon-link" onClick={() => setMenuOpen(false)}>
              <FaUserCircle className="user-icon" size={30} />
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}>
              Register
            </Link>
          </>
        )}
      </nav>

      <Search />
    </header>
  );
}

export default Header;