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

            <a href="https://www.linkedin.com/in/sanny-kumar-b9a1b4331?utm_source=share_via&utm_content=profile&utm_medium=member_android" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.5 8.5H3V21h3.5V8.5ZM4.75 3A2.05 2.05 0 1 0 4.75 7.1 2.05 2.05 0 0 0 4.75 3ZM21 13.85c0-3.76-2-5.5-4.68-5.5-2.15 0-3.1 1.18-3.64 2v-1.85H9.18V21h3.5v-6.18c0-1.63.31-3.2 2.32-3.2 1.98 0 2 1.86 2 3.31V21H21v-7.15Z" />
              </svg>
            </a>

            <a href="https://github.com/sannysharma435" aria-label="GitHub">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.5a9.5 9.5 0 0 0-3 18.51c.48.09.65-.21.65-.46v-1.63c-2.65.58-3.21-1.13-3.21-1.13-.43-1.1-1.05-1.4-1.05-1.4-.86-.59.07-.58.07-.58.95.07 1.45.98 1.45.98.84 1.44 2.2 1.03 2.74.79.08-.61.33-1.03.6-1.27-2.11-.24-4.33-1.06-4.33-4.71 0-1.04.37-1.88.98-2.54-.1-.24-.42-1.2.09-2.5 0 0 .8-.26 2.61.97A9.1 9.1 0 0 1 12 7.2c.81 0 1.63.11 2.4.33 1.81-1.23 2.61-.97 2.61-.97.51 1.3.19 2.26.09 2.5.61.66.98 1.5.98 2.54 0 3.66-2.22 4.47-4.34 4.71.34.29.64.86.64 1.73v2.51c0 .25.17.55.65.46A9.5 9.5 0 0 0 12 2.5Z" />
              </svg>
            </a>

            <a href="https://x.com/SannySh37646748" aria-label="Twitter">
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