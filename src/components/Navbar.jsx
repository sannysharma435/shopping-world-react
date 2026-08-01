import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        Shopping <span>World</span>
      </div>

      <ul className="menu">
        <li>Home</li>
        <li>Shop</li>
        <li>Categories</li>
        <li>Contact</li>
      </ul>

      <div className="right">
        <input
          type="text"
          placeholder="Search Products..."
        />

        <Link to="/login">
  <button>Login</button>
</Link>
      </div>

    </nav>
  );
}

export default Navbar;