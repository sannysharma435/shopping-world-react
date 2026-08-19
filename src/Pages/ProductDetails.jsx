import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./ProductDetails.css";

function ProductDetails() {
  const { name } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/products")
      .then((response) => response.json())
      .then((data) => {
        const foundProduct = data.find(
          (item) =>
            item.name.toLowerCase() ===
            decodeURIComponent(name).toLowerCase()
        );

        setProduct(foundProduct);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [name]);

  if (loading) {
    return (
      <div className="product-not-found">
        <h1>Loading Product...</h1>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h1>Product Not Found 😔</h1>

        <Link to="/">
          <button>Go Back Home</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="product-details">

      <div className="details-image">
        <span className="details-discount">
          {product.discount}
        </span>

        <img
          src={product.image}
          alt={product.name}
        />
      </div>

      <div className="details-info">

        <p className="details-category">
          {product.category}
        </p>

        <h1>{product.name}</h1>

        <div className="details-rating">
          ⭐ {product.rating}
          <span> ({product.reviews} Reviews)</span>
        </div>

        <h2 className="details-price">
          ₹{product.price.toLocaleString("en-IN")}
        </h2>

        <p className="details-delivery">
          🚚 {product.delivery}
        </p>

        <hr />

        <h3>Product Description</h3>

        <p className="details-description">
          {product.description}
        </p>

        <div className="product-specs">

          <div>
            <strong>Brand</strong>
            <span>{product.brand}</span>
          </div>

          <div>
            <strong>Color</strong>
            <span>{product.color}</span>
          </div>

          <div>
            <strong>Category</strong>
            <span>{product.category}</span>
          </div>

          <div>
            <strong>Availability</strong>
            <span className="stock">
              ● {product.availability}
            </span>
          </div>

        </div>

        <div className="details-buttons">

          <button className="details-cart">
            🛒 Add to Cart
          </button>

          <button className="details-buy">
            ⚡ Buy Now
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;