import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    const adminEmail = "admin@shoppingworld.com";
    const adminPassword = "admin123";

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    if (
      email.trim().toLowerCase() === adminEmail &&
      password === adminPassword
    ) {
      localStorage.setItem(
        "shoppingWorldAdmin",
        "true"
      );

      console.log("ADMIN LOGIN SUCCESS");

      navigate("/admin/orders", {
        replace: true
      });

      return;
    }

    setError("Invalid admin email or password.");
  };

  return (
    <div className="admin-login-page">

      <div className="admin-login-card">

        <div className="admin-logo">
          🛍️
        </div>

        <p className="admin-brand">
          SHOPPING WORLD
        </p>

        <h1>Admin Login</h1>

        <p className="admin-login-subtitle">
          Sign in to manage your store
        </p>

        <form onSubmit={handleLogin}>

          <div className="admin-input-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              placeholder="admin@shoppingworld.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              autoComplete="username"
            />

          </div>

          <div className="admin-input-group">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              autoComplete="current-password"
            />

          </div>

          {error && (
            <div className="admin-login-error">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-login-button"
          >
            🔐 Login to Admin Panel
          </button>

        </form>

        <button
          type="button"
          className="back-store-button"
          onClick={() => navigate("/")}
        >
          ← Back to Shopping World
        </button>

      </div>

    </div>
  );
}

export default AdminLogin;