import { useState } from "react";
import { Link } from "react-router-dom";
import { getRecentlyViewed } from "../services/recentActivityService";
import "./RecentlyViewed.css";

function RecentlyViewed() {
  const [products] = useState(getRecentlyViewed);

  if (!products.length) {
    return null;
  }

  return (
    <section className="recently-viewed-section">
      <div className="recently-viewed-heading">
        <div>
          <span>YOUR BROWSING HISTORY</span>
          <h2>Recently viewed</h2>
        </div>
        <Link to="/shop">View all products</Link>
      </div>

      <div className="recently-viewed-grid">
        {products.slice(0, 4).map((product) => (
          <Link
            key={product.name}
            to={`/product/${encodeURIComponent(product.name)}`}
            className="recently-viewed-card"
          >
            <img src={product.image} alt={product.name} />
            <div>
              <h3>{product.name}</h3>
              <span>⭐ {product.rating}</span>
              <strong>₹{Number(product.price).toLocaleString("en-IN")}</strong>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default RecentlyViewed;
