import "./Home.css";

import Hero from "../components/Hero";
import Products from "../components/Products";
import Footer from "../components/Footer";

function Home({ search }) {
  return (
    <div className="home-page">

      <Hero />

      <section className="home-categories">

        <div className="home-section-heading">
          <span>EXPLORE</span>
          <h2>Shop by Category</h2>
          <p>
            Find everything you need in one place
          </p>
        </div>

        <div className="category-grid">

          <div className="category-card">
            <div className="category-icon">👕</div>
            <h3>Fashion</h3>
            <p>Trendy styles for everyone</p>
          </div>

          <div className="category-card">
            <div className="category-icon">📱</div>
            <h3>Electronics</h3>
            <p>Latest gadgets & devices</p>
          </div>

          <div className="category-card">
            <div className="category-icon">👟</div>
            <h3>Shoes</h3>
            <p>Step into something new</p>
          </div>

          <div className="category-card">
            <div className="category-icon">🎧</div>
            <h3>Audio</h3>
            <p>Music without limits</p>
          </div>

          <div className="category-card">
            <div className="category-icon">⌚</div>
            <h3>Watches</h3>
            <p>Smart & stylish watches</p>
          </div>

          <div className="category-card">
            <div className="category-icon">🏠</div>
            <h3>Home</h3>
            <p>Make your space better</p>
          </div>

        </div>

      </section>

      <section className="mega-sale">

        <div className="sale-content">

          <span className="sale-small">
            LIMITED TIME OFFER
          </span>

          <h2>
            Mega Shopping Sale
          </h2>

          <p>
            Get amazing products at prices you'll love.
          </p>

          <div className="sale-discount">
            UP TO <strong>50%</strong> OFF
          </div>

          <button
            className="sale-button"
            onClick={() => {
              window.location.href = "/shop";
            }}
          >
            Shop Deals →
          </button>

        </div>

        <div className="sale-decoration">
          🛍️
        </div>

      </section>

      <section className="why-shopping-world">

        <div className="home-section-heading">
          <span>SHOP WITH CONFIDENCE</span>
          <h2>Why Choose Shopping World?</h2>
          <p>
            Everything you need for a smooth shopping experience
          </p>
        </div>

        <div className="why-grid">

          <div className="why-card">
            <div className="why-icon">🚚</div>
            <h3>Fast Delivery</h3>
            <p>
              Get your orders delivered quickly and safely.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon">🔒</div>
            <h3>Secure Payment</h3>
            <p>
              Your payment information stays protected.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon">↩️</div>
            <h3>Easy Returns</h3>
            <p>
              Simple and convenient return experience.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon">🎧</div>
            <h3>24/7 Support</h3>
            <p>
              We're here whenever you need assistance.
            </p>
          </div>

        </div>

      </section>

      <section className="trending-products">

        <div className="home-section-heading">
          <span>TRENDING NOW</span>
          <h2>Featured Products</h2>
          <p>
            Our highest-rated products right now
          </p>
        </div>

        <Products
          search={search}
          limit={4}
          title=""
        />

      </section>

      <section className="home-newsletter">

        <div className="newsletter-content">

          <span>STAY UPDATED</span>

          <h2>
            Don't Miss Our Latest Deals
          </h2>

          <p>
            Discover new arrivals, special offers and exclusive deals.
          </p>

          <div className="newsletter-box">

            <input
              type="email"
              placeholder="Enter your email address"
            />

            <button>
              Subscribe
            </button>

          </div>

        </div>

      </section>

      <Footer />

    </div>
  );
}

export default Home;