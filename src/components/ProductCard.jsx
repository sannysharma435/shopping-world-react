import "./ProductCard.css";

function ProductCard({ image, name, price, rating }) {
  return (
    <div className="product-card">
      <img src={image} alt={name} />

      <div className="product-info">
        <h3>{name}</h3>

        <p className="rating">⭐ {rating}</p>

        <h2>{price}</h2>

        <div className="buttons">
          <button className="cart-btn">🛒 Add to Cart</button>
          <button className="wish-btn">❤️</button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;