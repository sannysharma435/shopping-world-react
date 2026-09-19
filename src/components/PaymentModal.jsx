import { useState } from "react";
import "./PaymentModal.css";
import Toast from "./Toast";
import OrderConfirmation from "./OrderConfirmation";

const API_URL = "http://localhost:5000";

function PaymentModal({
  product,
  quantity,
  total,
  deliveryDetails,
  onClose
}) {
  const [method, setMethod] = useState("upi");
  const [showQR, setShowQR] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });

  const [order, setOrder] = useState(null);

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

  const upiId = "9934421720@slc";

  const upiLink =
    `upi://pay?pa=${encodeURIComponent(upiId)}` +
    `&pn=${encodeURIComponent("Shopping World")}` +
    `&am=${Number(total).toFixed(2)}` +
    `&cu=INR` +
    `&tn=${encodeURIComponent(
      `Shopping World - ${product.name}`
    )}`;

  const qrUrl =
    `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      upiLink
    )}`;

  const createOrder = async (paymentStatus) => {
    if (!deliveryDetails) {
      showToast(
        "Delivery details are missing",
        "error"
      );
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      customer: {
        name: deliveryDetails.name,
        mobile: deliveryDetails.mobile,
        email: deliveryDetails.email
      },

      deliveryAddress: {
        house: deliveryDetails.house,
        area: deliveryDetails.area,
        city: deliveryDetails.city,
        state: deliveryDetails.state,
        pincode: deliveryDetails.pincode
      },

      delivery: {
        date: deliveryDetails.deliveryDate,
        timeSlot: deliveryDetails.timeSlot
      },

      product: {
        name: product.name,
        image: product.image,
        quantity: quantity,
        price: Number(total)
      },

      payment: {
        method: method,
        status: paymentStatus
      }
    };

    try {
      const response = await fetch(
        `${API_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(orderData)
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
          "Failed to create order"
        );
      }

      const createdOrder = {
        orderId: result.order.orderId,

        status: result.order.status,

        customer: result.order.customer,

        deliveryAddress:
          result.order.deliveryAddress,

        delivery:
          result.order.delivery,

        product:
          result.order.product,

        payment:
          result.order.payment,

        total: Number(total)
      };

      setOrder(createdOrder);

      setShowConfirmation(true);

    } catch (error) {
      console.error(
        "ORDER ERROR:",
        error
      );

      showToast(
        error.message ||
        "Unable to place order",
        "error"
      );

    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCOD = () => {
    createOrder("Pending - COD");
  };

  const handlePayment = () => {
    if (method === "cod") {
      handleCOD();
      return;
    }

    if (method === "qr" && !showQR) {
      showToast(
        "Please generate the QR code first",
        "warning"
      );
      return;
    }

    createOrder("Payment Pending");
  };

  if (showConfirmation && order) {
    return (
      <OrderConfirmation
        order={order}
        onClose={onClose}
      />
    );
  }

  return (
    <>
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
      />

      <div className="payment-overlay">
        <div className="payment-modal">

          <button
            className="payment-close"
            onClick={onClose}
          >
            ✕
          </button>

          <div className="payment-header">

            <div className="payment-icon">
              🔒
            </div>

            <div>
              <h2>Secure Payment</h2>

              <p>
                Choose your preferred payment method
              </p>
            </div>

          </div>

          <div className="payment-product">

            <img
              src={product.image}
              alt={product.name}
            />

            <div>

              <h3>
                {product.name}
              </h3>

              <p>
                Quantity:{" "}
                <strong>
                  {quantity}
                </strong>
              </p>

              <strong className="payment-price">
                ₹
                {Number(total).toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

          </div>

          <div className="delivery-preview">

            <div>
              <span>📍</span>

              <div>
                <strong>
                  Deliver to
                </strong>

                <p>
                  {deliveryDetails.name},{" "}
                  {deliveryDetails.mobile}
                </p>

                <small>
                  {deliveryDetails.house},{" "}
                  {deliveryDetails.area},{" "}
                  {deliveryDetails.city},{" "}
                  {deliveryDetails.state} -{" "}
                  {deliveryDetails.pincode}
                </small>
              </div>

            </div>

            <div>
              <span>📅</span>

              <div>
                <strong>
                  Delivery Schedule
                </strong>

                <p>
                  {deliveryDetails.deliveryDate}
                </p>

                <small>
                  {deliveryDetails.timeSlot}
                </small>
              </div>

            </div>

          </div>

          <h3 className="payment-title">
            Select Payment Method
          </h3>

          <div className="payment-methods">

            <button
              className={
                method === "upi"
                  ? "payment-method active"
                  : "payment-method"
              }
              onClick={() => {
                setMethod("upi");
                setShowQR(false);
              }}
            >
              <span>📱</span>

              <div>
                <strong>
                  UPI ID
                </strong>

                <small>
                  Pay using UPI ID
                </small>
              </div>

            </button>

            <button
              className={
                method === "qr"
                  ? "payment-method active"
                  : "payment-method"
              }
              onClick={() => {
                setMethod("qr");
                setShowQR(false);
              }}
            >
              <span>▦</span>

              <div>
                <strong>
                  UPI QR Code
                </strong>

                <small>
                  Scan and pay exact bill amount
                </small>
              </div>

            </button>

            <button
              className={
                method === "card"
                  ? "payment-method active"
                  : "payment-method"
              }
              onClick={() => {
                setMethod("card");
                setShowQR(false);
              }}
            >
              <span>💳</span>

              <div>
                <strong>
                  Card
                </strong>

                <small>
                  Credit / Debit Card
                </small>
              </div>

            </button>

            <button
              className={
                method === "cod"
                  ? "payment-method active"
                  : "payment-method"
              }
              onClick={() => {
                setMethod("cod");
                setShowQR(false);
              }}
            >
              <span>💵</span>

              <div>
                <strong>
                  Cash on Delivery
                </strong>

                <small>
                  Pay when your order arrives
                </small>
              </div>

            </button>

          </div>

          {method === "upi" && (
            <div className="payment-input-section">

              <label>
                UPI ID
              </label>

              <input
                type="text"
                value={upiId}
                readOnly
              />

              <small>
                Payment will be directed to this UPI ID.
              </small>

            </div>
          )}

          {method === "qr" && (
            <div className="qr-payment-section">

              <div className="qr-payment-header">

                <strong>
                  Scan to Pay
                </strong>

                <span>
                  ₹
                  {Number(total).toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

              {!showQR ? (

                <button
                  className="generate-qr-btn"
                  onClick={() =>
                    setShowQR(true)
                  }
                >
                  ▦ Generate UPI QR
                </button>

              ) : (

                <div className="qr-container">

                  <img
                    src={qrUrl}
                    alt="UPI Payment QR"
                  />

                  <strong>
                    Scan this QR using any UPI app
                  </strong>

                  <p>
                    Amount: ₹
                    {Number(total).toLocaleString(
                      "en-IN"
                    )}
                  </p>

                  <small>
                    UPI ID: {upiId}
                  </small>

                  <small>
                    Shopping World
                  </small>

                </div>

              )}

            </div>
          )}

          {method === "card" && (
            <div className="card-inputs">

              <div>

                <label>
                  Card Number
                </label>

                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                />

              </div>

              <div className="card-row">

                <div>

                  <label>
                    Expiry
                  </label>

                  <input
                    type="text"
                    placeholder="MM/YY"
                  />

                </div>

                <div>

                  <label>
                    CVV
                  </label>

                  <input
                    type="password"
                    placeholder="•••"
                  />

                </div>

              </div>

            </div>
          )}

          {method === "cod" && (
            <div className="cod-message">

              <span>
                🚚
              </span>

              <div>

                <strong>
                  Cash on Delivery
                </strong>

                <p>
                  No online payment is required.
                  Confirm your order directly.
                </p>

              </div>

            </div>
          )}

          <div className="payment-total">

            <span>
              Order Total
            </span>

            <strong>
              ₹
              {Number(total).toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

          <button
            className="pay-now-btn"
            onClick={handlePayment}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Processing Order..."
              : method === "cod"
              ? "✅ Confirm COD Order"
              : method === "qr"
              ? "📱 Payment Done"
              : `🔒 Pay ₹${Number(
                  total
                ).toLocaleString("en-IN")}`}
          </button>

          <p className="payment-security">
            🔒 Your payment information is secure
          </p>

        </div>
      </div>
    </>
  );
}

export default PaymentModal;