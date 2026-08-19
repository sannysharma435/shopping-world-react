import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Login({ setUser }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("❌ Please enter email and password");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem(
          "shoppingWorldUser",
          JSON.stringify(data.user)
        );

        setUser(data.user);

        setMessage(
          `✅ Welcome to Shopping World, ${data.user.name}!`
        );

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (error) {
      console.error(error);
      setMessage(
        "❌ Backend server se connection nahi ho raha"
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <h1>
          Shopping <span>World</span>
        </h1>

        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Link to="/forgot-password" className="forgot-password">
          Forgot Password?
        </Link>

        <button onClick={handleLogin}>
          Login
        </button>

        {message && (
          <p className="login-message">
            {message}
          </p>
        )}

        <p>
          Don't have an account?
          <Link to="/signup"> Sign Up</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;