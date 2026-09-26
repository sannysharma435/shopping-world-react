import { Link } from "react-router-dom";
import "./Home.css";

import Hero from "../components/Hero";
import Products from "../components/Products";
import Footer from "../components/Footer";
import RecentlyViewed from "../components/RecentlyViewed";
import { categories } from "../data/categories";

function Home({ search = "" }) {
  return (
    <div className="home-page">

      <Hero />

      <section className="home-categories">

        <div className="home-section-heading">

          <span>
            EXPLORE COLLECTION
          </span>

          <h2>
            Shop by Category
          </h2>

          <p>
            Discover products made for every part
            of your lifestyle
          </p>

        </div>

        <div className="category-grid">

          {categories.map((category) => (

            <Link
              key={category.name}
              to={`/shop?category=${encodeURIComponent(
                category.name
              )}`}
              className="category-card-link"
            >

              <div className="category-card">

                <div className="category-glow"></div>

                <div className="category-top">

                  <div className="category-icon">
                    {category.icon}
                  </div>

                  <div className="category-arrow">
                    ↗
                  </div>

                </div>

                <div className="category-info">

                  <h3>
                    {category.name}
                  </h3>

                  <p>
                    {category.description}
                  </p>

                  <span>
                    {category.tag}
                  </span>

                </div>

                <div className="category-explore">

                  <span>
                    Explore Category
                  </span>

                  <strong>
                    →
                  </strong>

                </div>

              </div>

            </Link>

          ))}

        </div>

      </section>

      <section className="mega-sale">

        <div className="sale-content">

          <span className="sale-small">
            LIMITED TIME OFFER
          </span>

          <h2>
            Mega Sale
          </h2>

          <p>
            Grab your favourite products before
            the offer ends.
          </p>

          <div className="sale-discount">
            Get up to
            <strong>50%</strong>
            OFF
          </div>

          <Link
            to="/shop"
            className="sale-button"
          >
            Shop Now →
          </Link>

        </div>

        <div className="sale-decoration">
          🛍️
        </div>

      </section>

      <section className="why-shopping-world">

        <div className="home-section-heading">

          <span>
            WHY SHOPPING WORLD
          </span>

          <h2>
            Shopping Made Better
          </h2>

          <p>
            Everything you need for a smooth
            shopping experience
          </p>

        </div>

        <div className="why-grid">

          <div className="why-card">

            <div className="why-icon">
              🚚
            </div>

            <h3>
              Fast Delivery
            </h3>

            <p>
              Quick and reliable delivery
              right to your doorstep.
            </p>

          </div>

          <div className="why-card">

            <div className="why-icon">
              🔒
            </div>

            <h3>
              Secure Shopping
            </h3>

            <p>
              Safe and protected checkout
              for your orders.
            </p>

          </div>

          <div className="why-card">

            <div className="why-icon">
              💎
            </div>

            <h3>
              Quality Products
            </h3>

            <p>
              Carefully selected products
              across multiple categories.
            </p>

          </div>

          <div className="why-card">

            <div className="why-icon">
              💬
            </div>

            <h3>
              Customer Support
            </h3>

            <p>
              We're here whenever
              you need assistance.
            </p>

          </div>

        </div>

      </section>

      <section className="trending-products">

        <div className="home-section-heading">

          <span>
            TRENDING NOW
          </span>

          <h2>
            Popular Products
          </h2>

          <p>
            Our highest-rated products right now
          </p>

        </div>

        <Products
          search={search}
          title=""
          limit={5}
          randomize={true}
        />

        <div className="show-more-container">

          <Link
            to="/shop"
            className="show-more-button"
          >
            Show More Products

            <span>
              →
            </span>

          </Link>

        </div>

      </section>

      <RecentlyViewed />

      <section className="home-newsletter">

        <div className="newsletter-content">

          <span>
            STAY UPDATED
          </span>

          <h2>
            Get the Latest Offers
          </h2>

          <p>
            Subscribe to our newsletter and
            never miss a deal.
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