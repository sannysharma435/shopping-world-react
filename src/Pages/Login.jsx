import "./Login.css";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Shopping World</h1>
        <h2>Login</h2>

        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />

        <button>Login</button>
        <p>
  Don't have an account?
  <Link to="/signup"> Sign Up</Link>
</p>
      </div>
    </div>
  );
}

export default Login;