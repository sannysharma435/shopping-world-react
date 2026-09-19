import "./BuyNowModal.css";
import { useState } from "react";
import PaymentModal from "./PaymentModal";
import DeliveryDetails from "./DeliveryDetails";

function BuyNowModal({ product, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [showDelivery, setShowDelivery] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const [deliveryDetails, setDeliveryDetails] = useState(null);

  if (!product) return null;

  const getPrice = (price) => {
    return (
      Number(
        String(price).replace(/[^0-9.]/g, "")
      ) || 0
    );
  };

  const price = getPrice(product.price);
  const total = price * quantity;

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const proceedToDelivery = () => {
    setShowDelivery(true);
  };

  const handleDeliveryContinue = (details) => {
    setDeliveryDetails(details);
    setShowDelivery(false);
    setShowPayment(true);
  };

  const closeDelivery = () => {
    setShowDelivery(false);
  };

  const closePayment = () => {
    setShowPayment(false);
  };

  return (
    <>
      {!showDelivery && !showPayment && (
        <div className="buy-modal-overlay">
          <div className="buy-modal">

            <button
              className="buy-modal-close"
              onClick={onClose}
            >
              ✕
            </button>

            <div className="buy-modal-header">
              <span>⚡</span>

              <div>
                <h2>Quick Checkout</h2>
                <p>Complete your order</p>
              </div>
            </div>

            <div className="buy-product">
              <div className="buy-product-image">
                <img
                  src={product.image}
                  alt={product.name}
                />
              </div>

              <div className="buy-product-info">
                <h3>{product.name}</h3>

                <p className="buy-rating">
                  ⭐ {product.rating}
                </p>

                <h2>
                  ₹{price.toLocaleString("en-IN")}
                </h2>
              </div>
            </div>

            <div className="buy-quantity">
              <span>Quantity</span>

              <div className="quantity-control">
                <button onClick={decreaseQuantity}>
                  −
                </button>

                <strong>{quantity}</strong>

                <button onClick={increaseQuantity}>
                  +
                </button>
              </div>
            </div>

            <div className="buy-benefits">

              <div>
                <span>🚚</span>

                <div>
                  <strong>Free Delivery</strong>
                  <small>
                    Delivery available
                  </small>
                </div>
              </div>

              <div>
                <span>🔒</span>

                <div>
                  <strong>Secure Checkout</strong>
                  <small>
                    Your information is protected
                  </small>
                </div>
              </div>

            </div>

            <div className="buy-summary">

              <div>
                <span>Price</span>

                <strong>
                  ₹{price.toLocaleString("en-IN")}
                </strong>
              </div>

              <div>
                <span>Quantity</span>

                <strong>{quantity}</strong>
              </div>

              <div className="buy-total">
                <span>Total</span>

                <strong>
                  ₹{total.toLocaleString("en-IN")}
                </strong>
              </div>

            </div>

            <button
              className="proceed-payment"
              onClick={proceedToDelivery}
            >
              📦 Enter Delivery Details
            </button>

          </div>
        </div>
      )}

      {showDelivery && (
        <DeliveryDetails
          product={product}
          quantity={quantity}
          total={total}
          onContinue={handleDeliveryContinue}
          onClose={closeDelivery}
        />
      )}

      {showPayment && (
        <PaymentModal
          product={product}
          quantity={quantity}
          total={total}
          deliveryDetails={deliveryDetails}
          onClose={closePayment}
        />
      )}
    </>
  );
}

export default BuyNowModal;