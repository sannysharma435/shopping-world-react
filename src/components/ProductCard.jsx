import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ image, name, price, rating }) {
  const navigate = useNavigate();

  const openProduct = () => {
    navigate(`/product/${encodeURIComponent(name)}`);
  };

  return (
    <div className="product-card">

      <div
        className="image-box"
        onClick={openProduct}
      >
        <span className="discount">20% OFF</span>
        <span className="heart">❤</span>

        <img src={image} alt={name} />
      </div>

      <div className="product-info">

        <h3 onClick={openProduct}>
          {name}
        </h3>

        <p className="rating">
          ⭐ {rating} (245 Reviews)
        </p>

        <h2>{price}</h2>

        <p className="delivery">
          🚚 Free Delivery
        </p>

        <div className="buttons">

          <button className="cart-btn">
            🛒 Add to Cart
          </button>

          <button className="buy-btn">
            ⚡ Buy Now
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductCard;