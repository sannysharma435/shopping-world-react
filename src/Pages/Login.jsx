import "./Login.css";

function Login() {
  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Shopping World</h1>
        <h2>Login</h2>

        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />

        <button>Login</button>
      </div>
    </div>
  );
}

export default Login;