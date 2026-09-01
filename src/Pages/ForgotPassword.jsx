import "./ForgotPassword.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

  const sendOtp = async () => {
    if (!email) {
      setMessage("❌ Please enter your email");
      return;
    }

    try {
      const response = await fetch(
        "https://shopping-world-react-production-3fd5.up.railway.app/api/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ OTP sent to your email");
        setStep(2);
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (error) {
      setMessage("❌ Backend server se connection nahi ho raha");
    }
  };

  const resetPassword = async () => {
    if (!otp || !password || !confirmPassword) {
      setMessage("❌ Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "https://shopping-world-react-production-3fd5.up.railway.app/api/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            otp,
            password
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Password reset successfully");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (error) {
      setMessage("❌ Backend server se connection nahi ho raha");
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">

        <h1>
          Shopping <span>World</span>
        </h1>

        {step === 1 && (
          <>
            <h2>Forgot Password?</h2>

            <p>
              Enter your registered email address.
            </p>

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button onClick={sendOtp}>
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2>Verify OTP</h2>

            <p>
              Enter the OTP sent to your email.
            </p>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button onClick={resetPassword}>
              Reset Password
            </button>
          </>
        )}

        {message && (
          <p className="forgot-message">
            {message}
          </p>
        )}

        <Link to="/login" className="back-login">
          ← Back to Login
        </Link>

      </div>
    </div>
  );
}

export default ForgotPassword;