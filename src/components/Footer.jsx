import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-section footer-brand">
          <h2>
            Shopping <span>World</span>
          </h2>

          <p>
            Discover amazing products at great prices.
            Shop easily, safely and comfortably.
          </p>

          <div className="social-icons">

            <a href="#" aria-label="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14 8h3V4h-3c-3.31 0-5 1.69-5 5v3H6v4h3v8h4v-8h3.2l.8-4H13V9c0-.67.33-1 1-1Z" />
              </svg>
            </a>

            <a href="#" aria-label="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" className="social-dot" />
              </svg>
            </a>

            <a href="#" aria-label="Twitter">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 4h4.1l3.2 4.5L16 4h3l-5.3 6.1L20 20h-4.1l-3.7-5.1L7.5 20h-3l5.7-6.7L5 4Zm3.2 2 7.9 12h.7L8.9 6h-.7Z" />
              </svg>
            </a>

            <a href="#" aria-label="YouTube">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.8 2.8 0 0 0-2 2C2 9 2 12 2 12s0 3 .4 4.8a2.8 2.8 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.8 2.8 0 0 0 2-2C22 15 22 12 22 12s0-3-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
              </svg>
            </a>

          </div>
        </div>

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

        <div className="footer-section">
          <h3>Customer Service</h3>

          <ul>
            <li>Help Center</li>
            <li>Shipping & Delivery</li>
            <li>Return Policy</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>

          <p>📍 Muzaffarpur, Bihar</p>
          <p>📞 +91 9934421720</p>
          <p>✉️ sannysharmasrs@gmail.com</p>
        </div>

      </div>

      <div className="footer-bottom">

        <p>
          © 2026 Shopping World. All Rights Reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;