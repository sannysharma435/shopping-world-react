import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Wishlist.css";
import Toast from "../components/Toast";

function Wishlist() {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });

  useEffect(() => {
    const savedWishlist =
      JSON.parse(
        localStorage.getItem("shoppingWorldWishlist")
      ) || [];

    setWishlist(savedWishlist);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type
    });

    setTimeout(() => {
      setToast({
        show: false,
        message: "",
        type: "success"
      });
    }, 2800);
  };

  const updateWishlist = (updatedWishlist) => {
    setWishlist(updatedWishlist);

    localStorage.setItem(
      "shoppingWorldWishlist",
      JSON.stringify(updatedWishlist)
    );

    window.dispatchEvent(
      new Event("wishlistUpdated")
    );
  };

  const removeFromWishlist = (index) => {
    const product = wishlist[index];

    const updatedWishlist = [...wishlist];

    updatedWishlist.splice(index, 1);

    updateWishlist(updatedWishlist);

    showToast(
      `${product.name} removed from wishlist`,
      "wishlist"
    );
  };

  const addToCart = (product) => {
    const cart =
      JSON.parse(
        localStorage.getItem("shoppingWorldCart")
      ) || [];

    const existingProduct = cart.find(
      (item) => item.name === product.name
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        image: product.image,
        name: product.name,
        price: product.price,
        rating: product.rating,
        quantity: 1
      });
    }

    localStorage.setItem(
      "shoppingWorldCart",
      JSON.stringify(cart)
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    showToast(
      `${product.name} added to cart 🛒`,
      "success"
    );
  };

  const openProduct = (productName) => {
    navigate(
      `/product/${encodeURIComponent(productName)}`
    );
  };

  const clearWishlist = () => {
    updateWishlist([]);

    showToast(
      "All products removed from wishlist",
      "wishlist"
    );
  };

  return (
    <>
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
      />

      <div className="wishlist-page">
        <div className="wishlist-header">
          <div>
            <h1>
              My <span>Wishlist</span> ❤️
            </h1>

            <p>
              {wishlist.length}{" "}
              {wishlist.length === 1
                ? "Product"
                : "Products"}{" "}
              saved
            </p>
          </div>

          {wishlist.length > 0 && (
            <button
              className="clear-wishlist"
              onClick={clearWishlist}
            >
              🗑️ Clear Wishlist
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-wishlist-icon">
              ♡
            </div>

            <h2>
              Your Wishlist is Empty
            </h2>

            <p>
              Save your favorite products here and
              find them easily later.
            </p>

            <button
              onClick={() => navigate("/shop")}
            >
              🛍️ Explore Products
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((product, index) => (
              <div
                className="wishlist-card"
                key={`${product.name}-${index}`}
              >
                <div
                  className="wishlist-image"
                  onClick={() =>
                    openProduct(product.name)
                  }
                >
                  <span className="wishlist-badge">
                    20% OFF
                  </span>

                  <img
                    src={product.image}
                    alt={product.name}
                  />
                </div>

                <div className="wishlist-info">
                  <h2
                    onClick={() =>
                      openProduct(product.name)
                    }
                  >
                    {product.name}
                  </h2>

                  <p className="wishlist-rating">
                    ⭐ {product.rating} (245 Reviews)
                  </p>

                  <h3>{product.price}</h3>

                  <div className="wishlist-actions">
                    <button
                      className="wishlist-cart-btn"
                      onClick={() =>
                        addToCart(product)
                      }
                    >
                      🛒 Add to Cart
                    </button>

                    <button
                      className="wishlist-remove-btn"
                      onClick={() =>
                        removeFromWishlist(index)
                      }
                    >
                      ♡ Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Wishlist;