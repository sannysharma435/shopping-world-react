import { useEffect, useState } from "react";
import "./AdminOrders.css";

const API_URL = "https://shopping-world-react.onrender.com";

const statusOptions = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled"
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/orders`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message || "Unable to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      setUpdating(orderId);

      const response = await fetch(
        `${API_URL}/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update status"
        );
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.order_id === orderId
            ? {
                ...order,
                order_status: status
              }
            : order
        )
      );
    } catch (err) {
      alert(err.message || "Status update failed");
    } finally {
      setUpdating("");
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusClass = (status) => {
    return status
      ?.toLowerCase()
      .replace(/\s+/g, "-");
  };

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.order_status === "Pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.order_status === "Delivered"
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.order_status === "Cancelled"
  ).length;

  const totalRevenue = orders
    .filter((order) => order.order_status !== "Cancelled")
    .reduce(
      (total, order) =>
        total + Number(order.total_amount || 0),
      0
    );

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <div className="loading-spinner"></div>
          <h2>Loading Orders...</h2>
          <p>Please wait while orders are being loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">

      <div className="admin-header">
        <div>
          <p className="admin-label">
            SHOPPING WORLD
          </p>

          <h1>Order Management</h1>

          <p className="admin-subtitle">
            Manage customer orders and delivery status
          </p>
        </div>

        <button
          className="refresh-btn"
          onClick={fetchOrders}
        >
          ↻ Refresh Orders
        </button>
      </div>

      <div className="admin-stats">

        <div className="stat-card">
          <div className="stat-icon">📦</div>

          <div>
            <span>Total Orders</span>
            <strong>{totalOrders}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>

          <div>
            <span>Pending</span>
            <strong>{pendingOrders}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚚</div>

          <div>
            <span>Delivered</span>
            <strong>{deliveredOrders}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">₹</div>

          <div>
            <span>Revenue</span>
            <strong>
              ₹{totalRevenue.toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">❌</div>

          <div>
            <span>Cancelled</span>
            <strong>{cancelledOrders}</strong>
          </div>
        </div>

      </div>

      {error && (
        <div className="admin-error">
          ⚠️ {error}

          <button onClick={fetchOrders}>
            Try Again
          </button>
        </div>
      )}

      {!error && orders.length === 0 && (
        <div className="empty-orders">
          <div>📦</div>

          <h2>No Orders Yet</h2>

          <p>
            Customer orders will appear here after
            successful checkout.
          </p>
        </div>
      )}

      {orders.length > 0 && (
        <div className="orders-container">

          <div className="orders-heading">
            <div>
              <h2>All Orders</h2>

              <span>
                {orders.length} order
                {orders.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="orders-list">

            {orders.map((order) => (
              <div
                className="order-card"
                key={order.order_id}
              >

                <div className="order-top">

                  <div>
                    <span className="order-id-label">
                      ORDER ID
                    </span>

                    <h3>
                      {order.order_id}
                    </h3>
                  </div>

                  <div className="order-date">
                    <span>Order Date</span>

                    <strong>
                      {formatDateTime(
                        order.created_at
                      )}
                    </strong>
                  </div>

                  <div>
                    <span className="status-label">
                      STATUS
                    </span>

                    <select
                      className={`status-select ${getStatusClass(
                        order.order_status
                      )}`}
                      value={order.order_status}
                      disabled={
                        updating === order.order_id
                      }
                      onChange={(e) =>
                        updateStatus(
                          order.order_id,
                          e.target.value
                        )
                      }
                    >
                      {statusOptions.map(
                        (status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        )
                      )}
                    </select>

                    {updating ===
                      order.order_id && (
                      <small className="updating">
                        Updating...
                      </small>
                    )}
                  </div>

                </div>

                <div className="order-body">

                  <div className="order-product">

                    <h4>🛍️ Product</h4>

                    <div className="product-row">

                      {order.product_image && (
                        <img
                          src={order.product_image}
                          alt={order.product_name}
                        />
                      )}

                      <div>
                        <strong>
                          {order.product_name}
                        </strong>

                        <p>
                          Quantity:{" "}
                          {order.quantity}
                        </p>

                        <p className="product-price">
                          ₹
                          {Number(
                            order.total_amount
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>

                    </div>

                  </div>

                  <div className="customer-info">

                    <h4>👤 Customer</h4>

                    <p>
                      <span>Name</span>
                      <strong>
                        {order.customer_name}
                      </strong>
                    </p>

                    <p>
                      <span>Mobile</span>
                      <strong>
                        {order.customer_mobile}
                      </strong>
                    </p>

                    <p>
                      <span>Email</span>
                      <strong>
                        {order.customer_email}
                      </strong>
                    </p>

                  </div>

                  <div className="payment-info">

                    <h4>💳 Payment</h4>

                    <p>
                      <span>Method</span>
                      <strong>
                        {order.payment_method}
                      </strong>
                    </p>

                    <p>
                      <span>Status</span>
                      <strong className="payment-status">
                        {order.payment_status}
                      </strong>
                    </p>

                    <p>
                      <span>Total</span>
                      <strong className="amount">
                        ₹
                        {Number(
                          order.total_amount
                        ).toLocaleString("en-IN")}
                      </strong>
                    </p>

                  </div>

                </div>

                <div className="order-bottom">

                  <div className="address-info">

                    <h4>
                      📍 Delivery Address
                    </h4>

                    <p>
                      {order.house},{" "}
                      {order.area}
                    </p>

                    <p>
                      {order.city},{" "}
                      {order.state} -{" "}
                      {order.pincode}
                    </p>

                  </div>

                  <div className="delivery-info">

                    <h4>
                      🚚 Delivery
                    </h4>

                    <p>
                      <span>Date</span>

                      <strong>
                        {formatDate(
                          order.delivery_date
                        )}
                      </strong>
                    </p>

                    <p>
                      <span>Time</span>

                      <strong>
                        {order.time_slot}
                      </strong>
                    </p>

                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminOrders;