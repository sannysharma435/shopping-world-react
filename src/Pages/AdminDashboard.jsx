import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const API_BASE_URL = "https://shopping-world-react.onrender.com";

function AdminDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("shoppingWorldTheme") || "dark"
  );

  useEffect(() => {
    localStorage.setItem("shoppingWorldTheme", theme);
    document.documentElement.dataset.theme = theme;
    window.dispatchEvent(
      new CustomEvent("shoppingWorldThemeChange", { detail: theme })
    );
  }, [theme]);

  useEffect(() => {
    if (!settingsOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setSettingsOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [settingsOpen]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/api/orders`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load orders");
      }

      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.total_amount || 0),
      0
    );
    const pending = orders.filter(
      (order) =>
        ["Pending", "Confirmed", "Packed", "Shipped", "Out for Delivery"].includes(
          String(order.order_status || "")
        )
    ).length;
    const delivered = orders.filter(
      (order) => order.order_status === "Delivered"
    ).length;
    const cancelled = orders.filter(
      (order) => order.order_status === "Cancelled"
    ).length;

    const averageOrderValue =
      totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalOrders,
      totalRevenue,
      pending,
      delivered,
      cancelled,
      averageOrderValue
    };
  }, [orders]);

  const statusData = useMemo(() => {
    const values = [
      { name: "Delivered", color: "#16a34a" },
      { name: "Processing", color: "#0f9ea8" },
      { name: "Pending", color: "#3b82f6" },
      { name: "Cancelled", color: "#f59e0b" }
    ];

    return values.map((item) => ({
      ...item,
      count:
        item.name === "Processing"
          ? orders.filter((order) =>
              ["Confirmed", "Packed", "Shipped", "Out for Delivery"].includes(
                order.order_status
              )
            ).length
          : orders.filter((order) => order.order_status === item.name).length
    }));
  }, [orders]);

  const statusTotal = statusData.reduce((sum, item) => sum + item.count, 0);

  const topProducts = useMemo(() => {
    const grouped = {};

    orders.forEach((order) => {
      const name = order.product_name || "Product";
      if (!grouped[name]) {
        grouped[name] = {
          name,
          quantity: 0,
          revenue: 0
        };
      }

      grouped[name].quantity += Number(order.quantity || 1);
      grouped[name].revenue += Number(order.total_amount || 0);
    });

    return Object.values(grouped)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [orders]);

  const customers = useMemo(() => {
    const customerMap = new Map();

    orders.forEach((order) => {
      const name = String(order.customer_name || "Customer").trim();
      const email = String(order.customer_email || "").trim();
      const mobile = String(order.customer_mobile || "").trim();
      const key =
        email.toLowerCase() || mobile || name.toLowerCase() || order.order_id;
      const customer = customerMap.get(key) || {
        name,
        email,
        mobile,
        orderCount: 0,
        totalSpent: 0
      };

      customer.orderCount += 1;
      customer.totalSpent += Number(order.total_amount || 0);
      customerMap.set(key, customer);
    });

    return Array.from(customerMap.values()).sort(
      (first, second) => second.orderCount - first.orderCount
    );
  }, [orders]);

  const activityData = useMemo(() => {
    const now = new Date();
    const result = [];

    for (let index = 6; index >= 0; index -= 1) {
      const date = new Date(now);
      date.setDate(now.getDate() - index);

      const key = date.toISOString().slice(0, 10);
      const amount = orders
        .filter((order) => {
          if (!order.created_at) return false;
          return String(order.created_at).slice(0, 10) === key;
        })
        .reduce((sum, order) => sum + Number(order.total_amount || 0), 0);

      result.push({
        label: date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short"
        }),
        amount
      });
    }

    return result;
  }, [orders]);

  const chartPath = useMemo(() => {
    const width = 720;
    const height = 230;
    const padding = 22;
    const max = Math.max(...activityData.map((item) => item.amount), 1);

    return activityData
      .map((item, index) => {
        const x =
          padding +
          (index * (width - padding * 2)) /
            Math.max(activityData.length - 1, 1);
        const y =
          height -
          padding -
          (item.amount / max) * (height - padding * 2);

        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  }, [activityData]);

  const chartAreaPath = useMemo(() => {
    const width = 720;
    const height = 230;
    const padding = 22;
    const max = Math.max(...activityData.map((item) => item.amount), 1);

    const points = activityData.map((item, index) => {
      const x =
        padding +
        (index * (width - padding * 2)) /
          Math.max(activityData.length - 1, 1);
      const y =
        height -
        padding -
        (item.amount / max) * (height - padding * 2);

      return `${x} ${y}`;
    });

    if (!points.length) return "";

    return `M ${points[0]} L ${points.slice(1).join(" L ")} L ${
      width - padding
    } ${height - padding} L ${padding} ${height - padding} Z`;
  }, [activityData]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(Number(value || 0));

  const getStatusClass = (status) =>
    String(status || "Pending")
      .toLowerCase()
      .replace(/\s+/g, "-");

  const handleNavigation = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const handleSectionNavigation = (section, targetId) => {
    setActiveSection(section);
    setSidebarOpen(false);
    document.getElementById(targetId)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("shoppingWorldAdmin");
    setSidebarOpen(false);
    navigate("/admin/login");
  };

  return (
    <div className="admin-dashboard">
      <div
        className={`admin-sidebar-overlay ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <aside className={`admin-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="admin-sidebar-brand">
          <div className="admin-sidebar-logo">🛍️</div>
          <div>
            <strong>Shopping World</strong>
            <span>ADMIN DASHBOARD</span>
          </div>
          <button
            className="admin-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <div className="admin-sidebar-section-title">OVERVIEW</div>

        <nav className="admin-sidebar-nav">
          <button
            className={`admin-nav-item ${activeSection === "dashboard" ? "active" : ""}`}
            onClick={() => {
              setActiveSection("dashboard");
              setSidebarOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <span>⌂</span>
            <strong>Dashboard</strong>
          </button>

          <button
            className="admin-nav-item"
            onClick={() => handleNavigation("/admin/orders")}
          >
            <span>▣</span>
            <strong>Orders</strong>
            <b>{orders.length}</b>
          </button>

          <button
            className={`admin-nav-item ${activeSection === "products" ? "active" : ""}`}
            onClick={() => handleSectionNavigation("products", "dashboard-products")}
          >
            <span>▤</span>
            <strong>Products</strong>
          </button>

          <button
            className={`admin-nav-item ${activeSection === "customers" ? "active" : ""}`}
            onClick={() => handleSectionNavigation("customers", "dashboard-customers")}
          >
            <span>♙</span>
            <strong>Customers</strong>
          </button>

          <button
            className={`admin-nav-item ${activeSection === "analytics" ? "active" : ""}`}
            onClick={() => handleSectionNavigation("analytics", "dashboard-analytics")}
          >
            <span>▥</span>
            <strong>Analytics</strong>
          </button>

          <button
            className="admin-nav-item"
            onClick={() => {
              setSidebarOpen(false);
              setSettingsOpen(true);
            }}
          >
            <span>⚙</span>
            <strong>Settings</strong>
          </button>
        </nav>

        <div className="admin-sidebar-section-title apps-title">STORE</div>

        <div className="admin-sidebar-bottom">
          <button
            className="admin-store-btn"
            onClick={() => handleNavigation("/")}
          >
            <span>←</span>
            Back to Store
          </button>

          <button className="admin-logout-btn" onClick={handleLogout}>
            <span>↪</span>
            Logout
          </button>

          <div className="admin-sidebar-user">
            <div className="admin-sidebar-avatar">A</div>
            <div>
              <strong>Administrator</strong>
              <span>Store Manager</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="admin-dashboard-main">
        <div className="admin-content">
          <button
            className="admin-dashboard-menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open admin menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className="admin-page-heading">
            <div>
              <span>SHOPPING WORLD</span>
              <h1>eCommerce</h1>
              <p>Track your sales performance and commerce metrics.</p>
            </div>

            <button
              className="admin-refresh-button"
              onClick={fetchOrders}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh Data"}
            </button>
          </div>

          {error && (
            <div className="dashboard-error">
              <span>{error}</span>
              <button onClick={fetchOrders}>Retry</button>
            </div>
          )}

          <section className="dashboard-stats">
            <div className="dashboard-stat-card">
              <div className="stat-card-top">
                <span>Total Sales</span>
                <div className="stat-icon green">₹</div>
              </div>
              <strong>{formatCurrency(stats.totalRevenue)}</strong>
              <small className="positive">↗ Live store revenue</small>
              <div className="stat-sparkline green-line"></div>
            </div>

            <div className="dashboard-stat-card">
              <div className="stat-card-top">
                <span>Avg Order Value</span>
                <div className="stat-icon cyan">▣</div>
              </div>
              <strong>{formatCurrency(stats.averageOrderValue)}</strong>
              <small className="positive">↗ Average per order</small>
              <div className="stat-sparkline cyan-line"></div>
            </div>

            <div className="dashboard-stat-card">
              <div className="stat-card-top">
                <span>Conversion Activity</span>
                <div className="stat-icon blue">↗</div>
              </div>
              <strong>{stats.totalOrders}</strong>
              <small className="positive">↗ Total orders received</small>
              <div className="stat-sparkline blue-line"></div>
            </div>

            <div className="dashboard-stat-card">
              <div className="stat-card-top">
                <span>Refund / Cancel Rate</span>
                <div className="stat-icon yellow">↻</div>
              </div>
              <strong>
                {stats.totalOrders
                  ? `${((stats.cancelled / stats.totalOrders) * 100).toFixed(1)}%`
                  : "0.0%"}
              </strong>
              <small className="negative">
                {stats.cancelled} cancelled orders
              </small>
              <div className="stat-sparkline yellow-line"></div>
            </div>
          </section>

          <section className="dashboard-main-grid" id="dashboard-analytics">
            <div className="dashboard-panel sales-overview-panel">
              <div className="panel-header">
                <div>
                  <h2>Sales Overview</h2>
                  <p>Daily order revenue for the last 7 days</p>
                </div>

                <button onClick={() => navigate("/admin/orders")}>
                  Orders
                </button>
              </div>

              <div className="sales-chart">
                <div className="chart-y-axis">
                  <span>{formatCurrency(Math.max(stats.totalRevenue, 1000))}</span>
                  <span>{formatCurrency(Math.max(stats.totalRevenue * 0.75, 750))}</span>
                  <span>{formatCurrency(Math.max(stats.totalRevenue * 0.5, 500))}</span>
                  <span>{formatCurrency(Math.max(stats.totalRevenue * 0.25, 250))}</span>
                  <span>₹0</span>
                </div>

                <div className="chart-area">
                  <div className="chart-grid-line line-1"></div>
                  <div className="chart-grid-line line-2"></div>
                  <div className="chart-grid-line line-3"></div>
                  <div className="chart-grid-line line-4"></div>

                  <svg
                    viewBox="0 0 720 230"
                    preserveAspectRatio="none"
                    className="sales-svg"
                  >
                    <defs>
                      <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#16a34a" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    <path d={chartAreaPath} fill="url(#salesFill)" />
                    <path
                      d={chartPath}
                      fill="none"
                      stroke="#16a34a"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {activityData.map((item, index) => {
                      const max = Math.max(
                        ...activityData.map((entry) => entry.amount),
                        1
                      );
                      const x = 22 + (index * 676) / 6;
                      const y = 208 - (item.amount / max) * 186;

                      return (
                        <circle
                          key={`${item.label}-${index}`}
                          cx={x}
                          cy={y}
                          r="4"
                          fill="#ffffff"
                          stroke="#16a34a"
                          strokeWidth="3"
                        />
                      );
                    })}
                  </svg>

                  <div className="chart-x-axis">
                    {activityData.map((item) => (
                      <span key={item.label}>{item.label}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-panel order-status-panel">
              <div className="panel-header">
                <div>
                  <h2>Order Status</h2>
                  <p>Distribution of current orders</p>
                </div>
              </div>

              <div className="donut-wrap">
                <div
                  className="status-donut"
                  style={{
                    background: `conic-gradient(
                      #16a34a 0deg ${
                        statusTotal ? (statusData[0].count / statusTotal) * 360 : 0
                      }deg,
                      #0f9ea8 0deg ${
                        statusTotal
                          ? ((statusData[0].count + statusData[1].count) /
                              statusTotal) *
                            360
                          : 0
                      }deg,
                      #3b82f6 0deg ${
                        statusTotal
                          ? ((statusData[0].count +
                              statusData[1].count +
                              statusData[2].count) /
                              statusTotal) *
                            360
                          : 0
                      }deg,
                      #f59e0b 0deg 360deg
                    )`
                  }}
                >
                  <div className="donut-center">
                    <strong>{statusTotal}</strong>
                    <span>Orders</span>
                  </div>
                </div>
              </div>

              <div className="status-legend">
                {statusData.map((item) => (
                  <div className="legend-row" key={item.name}>
                    <span>
                      <i style={{ background: item.color }}></i>
                      {item.name}
                    </span>
                    <strong>{item.count}</strong>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="dashboard-bottom-grid">
            <div className="dashboard-panel products-panel" id="dashboard-products">
              <div className="panel-header">
                <div>
                  <h2>Top Selling Products</h2>
                  <p>Best performing products from your orders</p>
                </div>

                <button onClick={() => navigate("/shop")}>View Store →</button>
              </div>

              <div className="product-table">
                <div className="product-table-head">
                  <span>#</span>
                  <span>Product</span>
                  <span>Sold</span>
                  <span>Revenue</span>
                  <span>Trend</span>
                </div>

                {topProducts.length === 0 ? (
                  <div className="dashboard-empty">
                    <strong>No product sales yet</strong>
                    <span>New orders will appear here.</span>
                  </div>
                ) : (
                  topProducts.map((product, index) => (
                    <div className="product-table-row" key={product.name}>
                      <span>{index + 1}</span>
                      <div className="product-name">
                        <strong>{product.name}</strong>
                        <small>Shopping World product</small>
                      </div>
                      <strong>{product.quantity}</strong>
                      <strong>{formatCurrency(product.revenue)}</strong>
                      <div className="mini-trend">
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="dashboard-panel quick-panel">
              <div className="panel-header">
                <div>
                  <h2>Store Summary</h2>
                  <p>Current commerce activity</p>
                </div>
              </div>

              <div className="summary-list">
                <div>
                  <span>Orders</span>
                  <strong>{stats.totalOrders}</strong>
                </div>
                <div>
                  <span>Delivered</span>
                  <strong>{stats.delivered}</strong>
                </div>
                <div>
                  <span>Pending</span>
                  <strong>{stats.pending}</strong>
                </div>
                <div>
                  <span>Cancelled</span>
                  <strong>{stats.cancelled}</strong>
                </div>
              </div>

              <button
                className="summary-action"
                onClick={() => navigate("/admin/orders")}
              >
                Manage Orders
              </button>
            </div>
          </section>

          <section className="dashboard-panel customer-directory-panel" id="dashboard-customers">
            <div className="panel-header">
              <div>
                <h2>Customers</h2>
                <p>Customer details and order totals</p>
              </div>
              <span className="customer-count">{customers.length} customers</span>
            </div>

            {customers.length === 0 ? (
              <div className="dashboard-empty">
                <strong>No customers yet</strong>
                <span>Customers appear here after their first order.</span>
              </div>
            ) : (
              <div className="customer-directory-scroll">
                <div className="customer-directory-table">
                  <div className="customer-directory-row customer-directory-head">
                    <span>NAME</span>
                    <span>CONTACT</span>
                    <span>ORDERS</span>
                    <span>TOTAL SPENT</span>
                  </div>
                  {customers.map((customer) => (
                    <div
                      className="customer-directory-row"
                      key={customer.email || customer.mobile || customer.name}
                    >
                      <strong>{customer.name}</strong>
                      <span>{customer.email || customer.mobile || "No contact details"}</span>
                      <span>{customer.orderCount}</span>
                      <strong>{formatCurrency(customer.totalSpent)}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="dashboard-panel recent-orders-panel">
            <div className="panel-header">
              <div>
                <h2>Recent Orders</h2>
                <p>Latest activity from your Shopping World store</p>
              </div>

              <button onClick={() => navigate("/admin/orders")}>
                View All →
              </button>
            </div>

            {loading ? (
              <div className="dashboard-loading">
                <div className="dashboard-spinner"></div>
                <p>Loading orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="dashboard-empty">
                <strong>No orders yet</strong>
                <span>Customer orders will appear here.</span>
              </div>
            ) : (
              <div className="recent-orders-table">
                <div className="recent-order-row table-heading">
                  <span>ORDER</span>
                  <span>CUSTOMER</span>
                  <span>PRODUCT</span>
                  <span>AMOUNT</span>
                  <span>STATUS</span>
                </div>

                {orders.slice(0, 5).map((order) => (
                  <div className="recent-order-row" key={order.order_id}>
                    <strong className="order-number">{order.order_id}</strong>

                    <div className="customer-cell">
                      <div className="customer-avatar">
                        {String(order.customer_name || "C")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <span>{order.customer_name || "Customer"}</span>
                    </div>

                    <div className="product-cell">
                      <span>{order.product_name || "Product"}</span>
                      <small>Qty: {order.quantity || 1}</small>
                    </div>

                    <strong>{formatCurrency(order.total_amount)}</strong>

                    <span
                      className={`order-status-badge ${getStatusClass(
                        order.order_status
                      )}`}
                    >
                      {order.order_status || "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {settingsOpen && (
        <div
          className="admin-settings-overlay"
          onClick={() => setSettingsOpen(false)}
        >
          <section
            className="admin-settings-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-settings-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="admin-settings-header">
              <div>
                <span>ADMIN PREFERENCES</span>
                <h2 id="admin-settings-title">Settings</h2>
              </div>
              <button
                className="admin-settings-close"
                onClick={() => setSettingsOpen(false)}
                aria-label="Close settings"
              >
                ×
              </button>
            </header>

            <div className="admin-setting-row">
              <div>
                <strong>Appearance</strong>
                <p>Choose the theme used across the application.</p>
              </div>
              <div className="admin-theme-options" role="group" aria-label="Theme">
                <button
                  className={theme === "dark" ? "selected" : ""}
                  aria-pressed={theme === "dark"}
                  onClick={() => setTheme("dark")}
                >
                  Dark
                </button>
                <button
                  className={theme === "light" ? "selected" : ""}
                  aria-pressed={theme === "light"}
                  onClick={() => setTheme("light")}
                >
                  Light
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
