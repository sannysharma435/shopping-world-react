import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import products from "../data/products";

function Navbar({ search, setSearch, user }) {
  const suggestions = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const navigate = useNavigate();

  const openProduct = (productName) => {
    navigate(`/product/${encodeURIComponent(productName)}`);
  };

  return (
    <nav className="navbar">

      <div className="logo">
        Shopping <span>World</span>
      </div>

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

      <div className="right">

        <div className="search-box">
          <input
            type="text"
            placeholder="Search Products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search !== "" && (
            <div className="suggestions">
              {suggestions.length > 0 ? (
                suggestions.map((item, index) => (
                  <div
                    key={index}
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

        {user ? (
          <button
            className="profile-btn"
            onClick={() => navigate("/profile")}
          >
            👤 {user.name}
          </button>
        ) : (
          <Link to="/login">
            <button>👤 Login</button>
          </Link>
        )}

      </div>

    </nav>
  );
}

export default Navbar;