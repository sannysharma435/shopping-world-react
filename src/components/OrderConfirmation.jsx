import "./OrderConfirmation.css";

function OrderConfirmation({ order, onClose }) {
  const formatDate = (date) => {
    if (!date) return "-";

    const formatted = new Date(date + "T00:00:00");

    return formatted.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  const paymentMethod =
    order.payment.method === "cod"
      ? "Cash on Delivery"
      : order.payment.method === "upi"
      ? "UPI"
      : order.payment.method === "qr"
      ? "UPI QR Code"
      : "Card";

  return (
    <div className="confirmation-overlay">

      <div className="confirmation-modal">

        <button
          className="confirmation-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <div className="confirmation-success">
          ✓
        </div>

        <h1>Order Confirmed!</h1>

        <p className="confirmation-subtitle">
          Your order has been successfully placed.
        </p>

        <div className="order-id-box">
          <span>ORDER ID</span>

          <strong>
            {order.orderId}
          </strong>
        </div>

        <div className="confirmation-status">
          <span className="status-dot"></span>

          <div>
            <strong>
              {order.status}
            </strong>

            <small>
              Your order is being processed
            </small>
          </div>
        </div>

        <div className="confirmation-product">

          <img
            src={order.product.image}
            alt={order.product.name}
          />

          <div className="confirmation-product-info">

            <h3>
              {order.product.name}
            </h3>

            <p>
              Quantity: {order.product.quantity}
            </p>

            <strong>
              ₹{Number(order.total).toLocaleString("en-IN")}
            </strong>

          </div>

        </div>

        <div className="confirmation-section">

          <h3>
            👤 Customer Details
          </h3>

          <div className="confirmation-grid">

            <div>
              <span>Full Name</span>
              <strong>
                {order.customer.name}
              </strong>
            </div>

            <div>
              <span>Mobile</span>
              <strong>
                {order.customer.mobile}
              </strong>
            </div>

            <div className="full">
              <span>Email</span>
              <strong>
                {order.customer.email}
              </strong>
            </div>

          </div>

        </div>

        <div className="confirmation-section">

          <h3>
            📍 Delivery Address
          </h3>

          <div className="address-box">

            <strong>
              {order.customer.name}
            </strong>

            <p>
              {order.deliveryAddress.house},{" "}
              {order.deliveryAddress.area}
            </p>

            <p>
              {order.deliveryAddress.city},{" "}
              {order.deliveryAddress.state} -{" "}
              {order.deliveryAddress.pincode}
            </p>

            <p>
              📱 {order.customer.mobile}
            </p>

          </div>

        </div>

        <div className="confirmation-section">

          <h3>
            🚚 Delivery Information
          </h3>

          <div className="confirmation-grid">

            <div>
              <span>Delivery Date</span>

              <strong>
                {formatDate(
                  order.delivery.date
                )}
              </strong>
            </div>

            <div>
              <span>Time Slot</span>

              <strong>
                {order.delivery.timeSlot}
              </strong>
            </div>

          </div>

        </div>

        <div className="confirmation-section">

          <h3>
            💳 Payment Information
          </h3>

          <div className="confirmation-grid">

            <div>
              <span>Payment Method</span>

              <strong>
                {paymentMethod}
              </strong>
            </div>

            <div>
              <span>Payment Status</span>

              <strong className="payment-status">
                {order.payment.status}
              </strong>
            </div>

          </div>

        </div>

        <div className="confirmation-total">

          <span>
            Order Total
          </span>

          <strong>
            ₹{Number(order.total).toLocaleString("en-IN")}
          </strong>

        </div>

        <div className="confirmation-email">

          <span>📧</span>

          <div>
            <strong>
              Confirmation Email
            </strong>

            <p>
              Order details will be sent to
              <br />
              <b>{order.customer.email}</b>
            </p>
          </div>

        </div>

        <button
          className="confirmation-home"
          onClick={onClose}
        >
          Continue Shopping
        </button>

      </div>

    </div>
  );
}

export default OrderConfirmation;