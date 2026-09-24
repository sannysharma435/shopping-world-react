import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useEffect, useState } from "react";
import { categories } from "../data/categories";
import { getProducts } from "../services/productService";

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getWords(text) {
  return normalizeText(text)
    .split(" ")
    .filter((word) => word.length > 0);
}

function singularize(word) {
  if (word.length <= 3) {
    return word;
  }

  if (word.endsWith("ies")) {
    return word.slice(0, -3) + "y";
  }

  if (word.endsWith("ves")) {
    return word.slice(0, -3) + "f";
  }

  if (word.endsWith("es")) {
    return word.slice(0, -2);
  }

  if (word.endsWith("s")) {
    return word.slice(0, -1);
  }

  return word;
}

function levenshteinDistance(first, second) {
  const a = String(first);
  const b = String(second);

  const matrix = Array.from(
    { length: a.length + 1 },
    () => Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) {
    matrix[i][0] = i;
  }

  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost =
        a[i - 1] === b[j - 1] ? 0 : 1;

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

function getWordScore(searchWord, productWords) {
  const normalizedSearch = singularize(searchWord);

  let bestScore = 0;

  productWords.forEach((productWord) => {
    const normalizedProduct =
      singularize(productWord);

    if (
      normalizedProduct === normalizedSearch
    ) {
      bestScore = Math.max(bestScore, 100);
      return;
    }

    if (
      normalizedProduct.includes(normalizedSearch) ||
      normalizedSearch.includes(normalizedProduct)
    ) {
      bestScore = Math.max(bestScore, 80);
      return;
    }

    if (
      normalizedSearch.length >= 4 &&
      normalizedProduct.length >= 4
    ) {
      const distance = levenshteinDistance(
        normalizedSearch,
        normalizedProduct
      );

      const allowedDistance =
        normalizedSearch.length >= 7 ? 2 : 1;

      if (distance <= allowedDistance) {
        bestScore = Math.max(bestScore, 60);
      }
    }
  });

  return bestScore;
}

function getProductScore(product, search) {
  const searchWords = getWords(search);

  if (!searchWords.length) {
    return 0;
  }

  const nameWords = getWords(product.name);
  const categoryWords = getWords(product.category);
  const brandWords = getWords(product.brand);
  const descriptionWords = getWords(
    product.description
  );

  let score = 0;
  let matchedWords = 0;

  searchWords.forEach((searchWord) => {
    const nameScore = getWordScore(
      searchWord,
      nameWords
    );

    const categoryScore = getWordScore(
      searchWord,
      categoryWords
    );

    const brandScore = getWordScore(
      searchWord,
      brandWords
    );

    const descriptionScore = getWordScore(
      searchWord,
      descriptionWords
    );

    const bestScore = Math.max(
      nameScore,
      categoryScore,
      brandScore,
      descriptionScore
    );

    if (bestScore > 0) {
      matchedWords += 1;

      if (nameScore > 0) {
        score += nameScore + 40;
      } else if (brandScore > 0) {
        score += brandScore + 25;
      } else if (categoryScore > 0) {
        score += categoryScore + 20;
      } else {
        score += descriptionScore;
      }
    }
  });

  const fullText = normalizeText(
    `${product.name} ${product.category} ${product.brand} ${product.description}`
  );

  const fullSearch = normalizeText(search);

  if (
    fullSearch.length > 1 &&
    fullText.includes(fullSearch)
  ) {
    score += 100;
  }

  if (matchedWords === searchWords.length) {
    score += 100;
  }

  return score;
}

function Navbar({ search = "", setSearch, user }) {
  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [products, setProducts] = useState([]);

  const updateCartCount = () => {
    const cart =
      JSON.parse(
        localStorage.getItem("shoppingWorldCart")
      ) || [];

    const count = cart.reduce(
      (total, item) =>
        total + (item.quantity || 0),
      0
    );

    setCartCount(count);
  };

  const updateWishlistCount = () => {
    const wishlist =
      JSON.parse(
        localStorage.getItem(
          "shoppingWorldWishlist"
        )
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

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        const data = await getProducts();

        if (active) {
          setProducts(data);
        }
      } catch (error) {
        console.error(
          "NAVBAR PRODUCT ERROR:",
          error
        );
      }
    };

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const searchText = search.trim();

  const suggestions = searchText
    ? products
        .map((product) => ({
          product,
          score: getProductScore(
            product,
            searchText
          )
        }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8)
        .map((item) => item.product)
    : [];

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
      `/shop?category=${encodeURIComponent(
        category
      )}`
    );
  };

  return (
    <nav className="navbar">

      <div className="logo">
        Shopping <span>World</span>
      </div>

      <ul className="menu">

        <li>
          <Link to="/">
            Home
          </Link>
        </li>

        <li>
          <Link to="/shop">
            Shop
          </Link>
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
                <span>
                  EXPLORE COLLECTION
                </span>

                <h3>
                  Shop by Category
                </h3>
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
          <Link to="/contact">
            Contact
          </Link>
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