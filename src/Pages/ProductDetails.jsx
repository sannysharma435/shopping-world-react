import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./ProductDetails.css";
import productsData from "../data/products";

function ProductDetails() {
  const { name } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const productName = decodeURIComponent(name || "");

    const foundProduct = productsData.find(
      (item) =>
        item.name.toLowerCase() === productName.toLowerCase()
    );

    setProduct(foundProduct || null);
    setLoading(false);
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

        <Link to="/shop">
          <button>Go Back to Shop</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="product-details">

      {/* Product Image */}
      <div className="details-image">

        {product.discount && (
          <span className="details-discount">
            {product.discount}
          </span>
        )}

        <img
          src={product.image}
          alt={product.name}
        />

      </div>

      {/* Product Information */}
      <div className="details-info">

        <p className="details-category">
          {product.category}
        </p>

        <h1>{product.name}</h1>

        <div className="details-rating">
          ⭐ {product.rating}

          {product.reviews && (
            <span>
              {" "}
              ({product.reviews} Reviews)
            </span>
          )}
        </div>

        <h2 className="details-price">
          ₹
          {typeof product.price === "number"
            ? product.price.toLocaleString("en-IN")
            : product.price}
        </h2>

        {product.delivery && (
          <p className="details-delivery">
            🚚 {product.delivery}
          </p>
        )}

        <hr />

        <h3>Product Description</h3>

        <p className="details-description">
          {product.description ||
            "This is a high-quality product available at Shopping World."}
        </p>

        {/* Product Specifications */}
        <div className="product-specs">

          {product.brand && (
            <div>
              <strong>Brand</strong>
              <span>{product.brand}</span>
            </div>
          )}

          {product.color && (
            <div>
              <strong>Color</strong>
              <span>{product.color}</span>
            </div>
          )}

          <div>
            <strong>Category</strong>
            <span>{product.category}</span>
          </div>

          {product.availability && (
            <div>
              <strong>Availability</strong>

              <span className="stock">
                ● {product.availability}
              </span>
            </div>
          )}

        </div>

        {/* Buttons */}
        <div className="details-buttons">

          <button
            className="details-cart"
            onClick={() => alert("Product added to cart 🛒")}
          >
            🛒 Add to Cart
          </button>

          <button
            className="details-buy"
            onClick={() => alert("Buy Now feature coming soon ⚡")}
          >
            ⚡ Buy Now
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;