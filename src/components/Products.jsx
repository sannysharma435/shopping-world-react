import { useEffect, useState } from "react";
import "./Products.css";
import ProductCard from "./ProductCard";

function Products({ search = "" }) {

  // Backend se products store karne ke liye
  const [products, setProducts] = useState([]);

  // Loading check karne ke liye
  const [loading, setLoading] = useState(true);

  // Backend error check karne ke liye
  const [error, setError] = useState("");

  // Flask backend se products fetch karna
  useEffect(() => {

    fetch("http://127.0.0.1:5000/api/products")
      .then((response) => {

        if (!response.ok) {
          throw new Error("Products API failed");
        }

        return response.json();
      })
      .then((data) => {

        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {

        console.error("Products fetch error:", error);
        setError("Products load nahi ho rahe.");
        setLoading(false);
      });

  }, []);

  // Search ko safely handle karna
  const searchText = search.trim().toLowerCase();

  // Search ke according products filter honge
  const filteredProducts = searchText
    ? products.filter((item) =>
        item.name.toLowerCase().includes(searchText)
      )
    : products;

  return (
    <section className="products">

      <h2>Featured Products</h2>

      {loading ? (

        <h2>Loading Products...</h2>

      ) : error ? (

        <h2>{error}</h2>

      ) : (

        <div className="product-grid">

          {filteredProducts.length > 0 ? (

            filteredProducts.map((item) => (
              <ProductCard
                key={item.id}
                image={item.image}
                name={item.name}
                price={`₹${item.price.toLocaleString("en-IN")}`}
                rating={item.rating}
              />
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