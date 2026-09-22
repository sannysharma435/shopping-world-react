import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import products from "../data/products";
import { useEffect, useState } from "react";

function Navbar({ search = "", setSearch, user }) {
  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const updateCartCount = () => {
    const cart =
      JSON.parse(localStorage.getItem("shoppingWorldCart")) || [];

    const count = cart.reduce(
      (total, item) => total + (item.quantity || 0),
      0
    );

    setCartCount(count);
  };

  const updateWishlistCount = () => {
    const wishlist =
      JSON.parse(
        localStorage.getItem("shoppingWorldWishlist")
      ) || [];

    setWishlistCount(wishlist.length);
  };

  useEffect(() => {
    updateCartCount();
    updateWishlistCount();

    window.addEventListener(
      "cartUpdated",
      updateCartCount
    );

    window.addEventListener(
      "wishlistUpdated",
      updateWishlistCount
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        updateCartCount
      );

      window.removeEventListener(
        "wishlistUpdated",
        updateWishlistCount
      );
    };
  }, []);

  const searchText = search.trim().toLowerCase();

  const suggestions = searchText
    ? products.filter((item) =>
        item.name.toLowerCase().includes(searchText)
      )
    : [];

  const categories = [
    {
      name: "Fashion",
      icon: "👕",
      description: "Clothing & lifestyle"
    },
    {
      name: "Electronics",
      icon: "📱",
      description: "Latest gadgets"
    },
    {
      name: "Shoes",
      icon: "👟",
      description: "Trending footwear"
    },
    {
      name: "Audio",
      icon: "🎧",
      description: "Music & sound"
    },
    {
      name: "Watches",
      icon: "⌚",
      description: "Smart & stylish"
    },
    {
      name: "Home",
      icon: "🏠",
      description: "Home essentials"
    }
  ];

  const openProduct = (productName) => {
    setSearch("");

    navigate(
      `/product/${encodeURIComponent(productName)}`
    );
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const openCart = () => {
    navigate("/cart");
  };

  const openWishlist = () => {
    navigate("/wishlist");
  };

  const openCategory = (category) => {
    navigate(
      `/shop?category=${encodeURIComponent(category)}`
    );
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

        <li className="categories-menu">

          <Link to="/categories">
            Categories
            <span className="category-chevron">
              ▾
            </span>
          </Link>

          <div className="categories-dropdown">

            <div className="dropdown-header">
              <div>
                <span>EXPLORE COLLECTION</span>
                <h3>Shop by Category</h3>
              </div>

              <Link
                to="/categories"
                className="view-all-link"
              >
                View All →
              </Link>
            </div>

            <div className="dropdown-grid">

              {categories.map((category) => (
                <button
                  key={category.name}
                  className="dropdown-category"
                  onClick={() =>
                    openCategory(category.name)
                  }
                >

                  <div className="dropdown-category-icon">
                    {category.icon}
                  </div>

                  <div className="dropdown-category-info">
                    <strong>
                      {category.name}
                    </strong>

                    <span>
                      {category.description}
                    </span>
                  </div>

                  <span className="dropdown-arrow">
                    →
                  </span>

                </button>
              ))}

            </div>

          </div>

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
            onChange={handleSearchChange}
          />

          {searchText && (
            <div className="suggestions">

              {suggestions.length > 0 ? (
                suggestions.map((item) => (
                  <div
                    key={item.id}
                    className="suggestion-item"
                    onClick={() =>
                      openProduct(item.name)
                    }
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

        <button
          className="wishlist-nav-btn"
          onClick={openWishlist}
        >
          ❤️ Wishlist

          {wishlistCount > 0 && (
            <span className="wishlist-count">
              {wishlistCount}
            </span>
          )}
        </button>

        <button
          className="cart-nav-btn"
          onClick={openCart}
        >
          🛒 Cart

          {cartCount > 0 && (
            <span className="cart-count">
              {cartCount}
            </span>
          )}
        </button>

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