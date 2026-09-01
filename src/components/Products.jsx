import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Products.css";
import ProductCard from "./ProductCard";
import productsData from "../data/products";

function Products({ search = "" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    setProducts(productsData);
    setLoading(false);
  }, []);

  const searchText = search.trim().toLowerCase();

  const filteredProducts = searchText
    ? products.filter((item) =>
        item.name.toLowerCase().includes(searchText)
      )
    : products;

  const openProduct = (productName) => {
    navigate(`/product/${encodeURIComponent(productName)}`);
  };

  return (
    <section className="products">

      <h2>Featured Products</h2>

      {loading ? (

        <h2>Loading Products...</h2>

      ) : (

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