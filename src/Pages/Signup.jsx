import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Signup() {

  const navigate = useNavigate();

  // Form ki values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");

  // Signup button
  const handleSignup = async () => {

    // Password check
    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    if (!name || !email || !phone || !password) {
      setMessage("❌ Please fill all fields");
      return;
    }

    try {

      const response = await fetch(
        "https://shopping-world-react-production.up.railway.app/api/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Account created successfully!");

        setTimeout(() => {
          navigate("/login");
        }, 1000);

      } else {
        setMessage("❌ " + data.message);
      }

    } catch (error) {

      console.error(error);
      setMessage("❌ Backend server se connection nahi ho raha");

    }
  };

  return (
    <div className="signup-container">

      <div className="signup-box">

        <h1>
          Shopping <span>World</span>
        </h1>

        <h2>Create Account</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button onClick={handleSignup}>
          Create Account
        </button>

        {message && (
          <p className="signup-message">
            {message}
          </p>
        )}

        <p>
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>

      </div>

    </div>
  );
}

export default Signup;