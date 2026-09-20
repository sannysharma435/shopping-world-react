import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Products.css";
import ProductCard from "./ProductCard";

const API_URL =
  "https://shopping-world-react.onrender.com/api/products";

function Products({
  search = "",
  limit = null,
  title = "Featured Products"
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setProducts(data);
      } catch (error) {
        console.error("PRODUCT FETCH ERROR:", error);
        setError("Products load nahi ho paaye.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const searchText = search.trim().toLowerCase();

  let filteredProducts = searchText
    ? products.filter((item) =>
        item.name.toLowerCase().includes(searchText)
      )
    : products;

  if (limit) {
    filteredProducts = [...filteredProducts]
      .sort((a, b) => {
        const ratingA = Number(a.rating) || 0;
        const ratingB = Number(b.rating) || 0;

        return ratingB - ratingA;
      })
      .slice(0, limit);
  }

  const openProduct = (productName) => {
    navigate(
      `/product/${encodeURIComponent(productName)}`
    );
  };

  return (
    <section className="products">

      <h2>{title}</h2>

      {loading && (
        <h2>Loading Products...</h2>
      )}

      {!loading && error && (
        <h2>{error}</h2>
      )}

      {!loading && !error && (
        <div className="product-grid">

          {filteredProducts.length > 0 ? (

            filteredProducts.map((item) => (
              <div
                key={item.id}
                onClick={() => openProduct(item.name)}
                style={{ cursor: "pointer" }}
              >
                <ProductCard
                  image={item.image}
                  name={item.name}
                  price={
                    typeof item.price === "number"
                      ? `₹${item.price.toLocaleString("en-IN")}`
                      : item.price
                  }
                  rating={item.rating}
                />
              </div>
            ))

          ) : (

            <h2>No Products Found 😔</h2>

          )}

        </div>
      )}

    </section>
  );
}

export default Products;