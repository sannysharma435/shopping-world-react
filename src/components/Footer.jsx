import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Brand */}
        <div className="footer-section footer-brand">
          <h2>
            Shopping <span>World</span>
          </h2>

          <p>
            Discover amazing products at great prices.
            Shop easily, safely and comfortably.
          </p>

          {/* Social Media */}
          <div className="social-icons">

            <a href="#" aria-label="Facebook">
              f
            </a>

            <a href="#" aria-label="Instagram">
              ◎
            </a>

            <a href="#" aria-label="Twitter">
              𝕏
            </a>

            <a href="#" aria-label="YouTube">
              ▶
            </a>

          </div>
        </div>


        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>

          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/shop">Shop</Link>
            </li>

            <li>
              <Link to="/categories">Categories</Link>
            </li>

            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>


        {/* Customer Service */}
        <div className="footer-section">
          <h3>Customer Service</h3>

          <ul>
            <li>Help Center</li>
            <li>Shipping & Delivery</li>
            <li>Return Policy</li>
            <li>Privacy Policy</li>
          </ul>
        </div>


        {/* Contact */}
        <div className="footer-section">
          <h3>Contact Us</h3>

          <p>📍 Muzaffarpur, Bihar</p>
          <p>📞 +91 98765 43210</p>
          <p>✉️ support@shoppingworld.com</p>
        </div>

      </div>


      {/* Bottom Footer */}
      <div className="footer-bottom">

        <p>
          © 2026 Shopping World. All Rights Reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;