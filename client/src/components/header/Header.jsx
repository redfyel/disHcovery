import { Link } from "react-router-dom";
import Search from "../search-box/Search";
import Explore from "../explore/Explore";
import logo from "../../assets/images/logo_og.png";
import { userLoginContext } from "../../contexts/UserLoginContext";
import "./Header.css";
import { useContext } from "react";
import { FaUserCircle } from "react-icons/fa"; 

function Header() {
  const { loginStatus, onLogin, onLogout } = useContext(userLoginContext);

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

        {loginStatus ? (
          <>
          <Link to="/login" onClick={onLogout}>
              Logout
            </Link>
            {/* User Icon Link to Dashboard */}
            <Link to="/dashboard" className="user-icon-link">
              <FaUserCircle className="user-icon" size={30} />
            </Link>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
      <Search />
    </header>
  );
}

export default Header;