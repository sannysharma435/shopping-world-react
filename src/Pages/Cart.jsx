import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import Toast from "../components/Toast";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });

  useEffect(() => {
    const savedCart =
      JSON.parse(
        localStorage.getItem("shoppingWorldCart")
      ) || [];

    setCart(savedCart);
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

  const updateCart = (updatedCart) => {
    setCart(updatedCart);

    localStorage.setItem(
      "shoppingWorldCart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };

  const increaseQuantity = (index) => {
    const updatedCart = [...cart];

    updatedCart[index].quantity += 1;

    updateCart(updatedCart);

    showToast(
      `${updatedCart[index].name} quantity increased`,
      "success"
    );
  };

  const decreaseQuantity = (index) => {
    const updatedCart = [...cart];

    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;

      showToast(
        `${updatedCart[index].name} quantity decreased`,
        "success"
      );
    } else {
      const productName = updatedCart[index].name;

      updatedCart.splice(index, 1);

      showToast(
        `${productName} removed from cart`,
        "wishlist"
      );
    }

    updateCart(updatedCart);
  };

  const removeProduct = (index) => {
    const productName = cart[index].name;

    const updatedCart = [...cart];

    updatedCart.splice(index, 1);

    updateCart(updatedCart);

    showToast(
      `${productName} removed from cart`,
      "wishlist"
    );
  };

  const clearCart = () => {
    updateCart([]);

    showToast(
      "All products removed from cart",
      "wishlist"
    );
  };

  const getPrice = (price) => {
    return (
      Number(
        String(price).replace(/[^0-9.]/g, "")
      ) || 0
    );
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      getPrice(item.price) *
        item.quantity,
    0
  );

  const delivery = subtotal > 0 ? 0 : 0;

  const total = subtotal + delivery;

  return (
    <>
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
      />

      <div className="cart-page">

        <div className="cart-header">
          <h1>
            Your <span>Cart</span>
          </h1>

          {cart.length > 0 && (
            <button
              className="clear-cart"
              onClick={clearCart}
            >
              🗑️ Clear Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">

            <div className="empty-icon">
              🛒
            </div>

            <h2>
              Your cart is empty
            </h2>

            <p>
              Looks like you haven't added
              anything yet.
            </p>

            <button
              onClick={() =>
                navigate("/shop")
              }
            >
              🛍️ Continue Shopping
            </button>

          </div>
        ) : (
          <div className="cart-content">

            <div className="cart-items">

              {cart.map((item, index) => (
                <div
                  className="cart-item"
                  key={`${item.name}-${index}`}
                >

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div className="cart-item-info">

                    <h2>
                      {item.name}
                    </h2>

                    <p>
                      ⭐ {item.rating}
                    </p>

                    <h3>
                      ₹
                      {getPrice(
                        item.price
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </h3>

                    <div className="quantity">

                      <button
                        onClick={() =>
                          decreaseQuantity(
                            index
                          )
                        }
                      >
                        −
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQuantity(
                            index
                          )
                        }
                      >
                        +
                      </button>

                    </div>

                  </div>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeProduct(index)
                    }
                  >
                    ✕
                  </button>

                </div>
              ))}

            </div>

            <div className="cart-summary">

              <h2>
                Order Summary
              </h2>

              <div className="summary-row">
                <span>
                  Subtotal
                </span>

                <strong>
                  ₹
                  {subtotal.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>

              <div className="summary-row">
                <span>
                  Delivery
                </span>

                <strong className="free">
                  FREE
                </strong>
              </div>

              <div className="summary-line"></div>

              <div className="summary-total">
                <span>
                  Total
                </span>

                <strong>
                  ₹
                  {total.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>

              <button
                className="checkout-btn"
                onClick={() =>
                  showToast(
                    "Checkout feature coming soon 💳",
                    "warning"
                  )
                }
              >
                💳 Proceed to Checkout
              </button>

              <button
                className="continue-btn"
                onClick={() =>
                  navigate("/shop")
                }
              >
                ← Continue Shopping
              </button>

            </div>

          </div>
        )}

      </div>
    </>
  );
}

export default Cart;