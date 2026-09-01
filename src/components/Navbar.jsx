import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import products from "../data/products";

function Navbar({ search = "", setSearch, user }) {
  const navigate = useNavigate();

  const searchText = search.trim().toLowerCase();

  const suggestions = searchText
    ? products.filter((item) =>
        item.name.toLowerCase().includes(searchText)
      )
    : [];

  const openProduct = (productName) => {
    setSearch("");
    navigate(`/product/${encodeURIComponent(productName)}`);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleLogoClick = () => {
    setSearch("");
    navigate("/");
  };

  return (
    <nav className="navbar">

      {/* Logo */}
      <div
        className="logo"
        onClick={handleLogoClick}
        style={{ cursor: "pointer" }}
      >
        Shopping <span>World</span>
      </div>

      {/* Menu */}
      <ul className="menu">

        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/shop">Shop</Link>
        </li>

        <li>
          <Link to="/categories">Categories</Link>
        </li>

        <li>
          <Link to="/contact">Contact</Link>
        </li>

      </ul>

      {/* Right Side */}
      <div className="right">

        {/* Search */}
        <div className="search-box">

          <input
            type="text"
            placeholder="Search Products..."
            value={search}
            onChange={handleSearchChange}
          />

          {searchText && (
            <div className="suggestions">

              {suggestions.length > 0 ? (

                suggestions.map((item) => (
                  <div
                    key={item.id}
                    className="suggestion-item"
                    onClick={() => openProduct(item.name)}
                  >
                    🔍 {item.name}
                  </div>
                ))

              ) : (

                <div className="suggestion-item not-found">
                  ❌ No Products Found
                </div>

              )}

            </div>
          )}

        </div>

        {/* Login / Profile */}
        {user ? (

          <button
            className="profile-btn"
            onClick={handleProfile}
          >
            👤 {user.name}
          </button>

        ) : (

          <Link to="/login">
            <button>
              👤 Login
            </button>
          </Link>

        )}

      </div>

    </nav>
  );
}

export default Navbar;