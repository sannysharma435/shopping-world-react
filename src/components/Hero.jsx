import { Link } from "react-router-dom";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-left">

        <h3>🔥 Big Sale</h3>

        <h1>
          UP TO <span>50% OFF</span>
        </h1>

        <p>
          Shop the latest fashion, electronics,
          shoes and much more.
        </p>

        <Link to="/shop">
          <button>Shop Now</button>
        </Link>

      </div>

      <div className="hero-right">

        <img
          src="/hero-shopping.png"
          alt="Shopping World"
        />

      </div>

    </section>
  );
}

export default Hero;