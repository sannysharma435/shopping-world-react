import "./Signup.css";
import { Link } from "react-router-dom";

function Signup() {
  return (
    <div className="signup-container">
      <div className="signup-box">

        <h1>Shopping <span>World</span></h1>
        <h2>Create Account</h2>

        <input type="text" placeholder="Full Name" />

        <input type="email" placeholder="Email Address" />

        <input type="tel" placeholder="Phone Number" />

        <input type="password" placeholder="Password" />

        <input type="password" placeholder="Confirm Password" />

        <button>Create Account</button>

        <p>
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;