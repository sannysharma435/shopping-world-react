import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Orders.css";

const API_URL = "https://shopping-world-react.onrender.com";

const orderSteps = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered"
];

function getOrderStatusIndex(status) {
  const normalizedStatus = String(status || "Pending");

  if (normalizedStatus.includes("COD")) {
    return 0;
  }

  return Math.max(0, orderSteps.indexOf(normalizedStatus));
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/api/orders`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load orders");
        }

        if (active) {
          setOrders(data.orders || []);
        }
      } catch (requestError) {
        const savedOrders = JSON.parse(
          localStorage.getItem("shoppingWorldOrders")
        ) || [];

        if (active) {
          setOrders(savedOrders);
          setError(
            savedOrders.length
              ? "Showing saved order history."
              : "Orders are unavailable right now."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <main className="orders-page">
        <div className="orders-state">
          <h1>Loading your orders...</h1>
          <p>We are retrieving your latest order history.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <header className="orders-page-header">
        <div>
          <span>ACCOUNT CENTER</span>
          <h1>My Orders</h1>
          <p>Track purchases and review delivery progress.</p>
        </div>
        <Link to="/shop" className="orders-shop-link">
          Continue shopping
        </Link>
      </header>

      {error && <p className="orders-notice">{error}</p>}

      {orders.length === 0 ? (
        <div className="orders-state">
          <div className="orders-empty-icon">📦</div>
          <h2>No orders yet</h2>
          <p>Your completed purchases will appear here.</p>
          <Link to="/shop">Explore products</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order, index) => {
            const product = order.product || {};
            const orderId = order.order_id || order.orderId || `LOCAL-${index + 1}`;
            const status = order.order_status || order.status || "Pending";
            const customer = order.customer || {};
            const delivery = order.delivery || {};
            const amount = order.total_amount || order.total || product.price || 0;

            return (
              <article className="customer-order-card" key={orderId}>
                <div className="customer-order-top">
                  <div>
                    <span>ORDER ID</span>
                    <strong>{orderId}</strong>
                  </div>
                  <div>
                    <span>STATUS</span>
                    <strong className={`customer-order-status ${status.toLowerCase().replace(/\s+/g, "-")}`}>
                      {status}
                    </strong>
                  </div>
                  <div>
                    <span>AMOUNT</span>
                    <strong>₹{Number(amount).toLocaleString("en-IN")}</strong>
                  </div>
                </div>

                <div className="customer-order-product">
                  {product.image && (
                    <img src={product.image} alt={product.name || "Ordered product"} />
                  )}
                  <div>
                    <h2>{product.name || order.product_name || "Shopping World order"}</h2>
                    <p>Quantity: {product.quantity || order.quantity || 1}</p>
                    <p>{customer.name || order.customer_name || "Customer"}</p>
                  </div>
                </div>

                <div className="order-timeline">
                  {orderSteps.map((step, stepIndex) => (
                    <div
                      className={stepIndex <= getOrderStatusIndex(status) ? "timeline-step active" : "timeline-step"}
                      key={step}
                    >
                      <span></span>
                      <small>{step}</small>
                    </div>
                  ))}
                </div>

                <div className="customer-order-footer">
                  <span>
                    {delivery.date || order.delivery_date
                      ? `Delivery: ${delivery.date || order.delivery_date}`
                      : "Delivery details available after checkout"}
                  </span>
                  <span>
                    {order.payment_status || order.payment?.status || "Payment pending"}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default Orders;
