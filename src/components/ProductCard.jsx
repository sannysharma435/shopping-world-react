import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";
import Toast from "./Toast";
import BuyNowModal from "./BuyNowModal";

function ProductCard({ image, name, price, rating }) {
  const navigate = useNavigate();

  const [isWishlisted, setIsWishlisted] = useState(false);

  const [showBuyModal, setShowBuyModal] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });

  useEffect(() => {
    const wishlist =
      JSON.parse(
        localStorage.getItem("shoppingWorldWishlist")
      ) || [];

    const exists = wishlist.some(
      (item) => item.name === name
    );

    setIsWishlisted(exists);
  }, [name]);

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

  const openProduct = () => {
    navigate(
      `/product/${encodeURIComponent(name)}`
    );
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();

    const wishlist =
      JSON.parse(
        localStorage.getItem("shoppingWorldWishlist")
      ) || [];

    const existingProduct = wishlist.find(
      (item) => item.name === name
    );

    let updatedWishlist;

    if (existingProduct) {
      updatedWishlist = wishlist.filter(
        (item) => item.name !== name
      );

      setIsWishlisted(false);

      showToast(
        `${name} removed from wishlist`,
        "wishlist"
      );
    } else {
      updatedWishlist = [
        ...wishlist,
        {
          image,
          name,
          price,
          rating
        }
      ];

      setIsWishlisted(true);

      showToast(
        `${name} added to wishlist`,
        "wishlist"
      );
    }

    localStorage.setItem(
      "shoppingWorldWishlist",
      JSON.stringify(updatedWishlist)
    );

    window.dispatchEvent(
      new Event("wishlistUpdated")
    );
  };

  const addToCart = () => {
    const cart =
      JSON.parse(
        localStorage.getItem("shoppingWorldCart")
      ) || [];

    const existingProduct = cart.find(
      (item) => item.name === name
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        image,
        name,
        price,
        rating,
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
      `${name} added to cart 🛒`,
      "success"
    );
  };

  const openBuyNow = () => {
    setShowBuyModal(true);
  };

  const closeBuyNow = () => {
    setShowBuyModal(false);
  };

  const product = {
    image,
    name,
    price,
    rating
  };

  return (
    <>
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
      />

      {showBuyModal && (
        <BuyNowModal
          product={product}
          onClose={closeBuyNow}
        />
      )}

      <div className="product-card">

        <div
          className="image-box"
          onClick={openProduct}
        >
          <span className="discount">
            20% OFF
          </span>

          <button
            className={`heart ${
              isWishlisted ? "active" : ""
            }`}
            onClick={toggleWishlist}
          >
            {isWishlisted ? "♥" : "♡"}
          </button>

          <img
            src={image}
            alt={name}
          />
        </div>

        <div className="product-info">

          <h3 onClick={openProduct}>
            {name}
          </h3>

          <p className="rating">
            ⭐ {rating} (245 Reviews)
          </p>

          <h2>{price}</h2>

          <p className="delivery">
            🚚 Free Delivery
          </p>

          <div className="buttons">

            <button
              className="cart-btn"
              onClick={addToCart}
            >
              🛒 Add to Cart
            </button>

            <button
              className="buy-btn"
              onClick={openBuyNow}
            >
              ⚡ Buy Now
            </button>

          </div>

        </div>

      </div>
    </>
  );
}

export default ProductCard;