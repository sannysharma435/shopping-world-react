import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Categories.css";

const API_URL =
  "https://shopping-world-react.onrender.com/api/products";

function Categories() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setProducts(data);
      } catch (error) {
        console.error("CATEGORY FETCH ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    ...new Set(products.map((item) => item.category))
  ];

  const openCategory = (category) => {
    navigate(
      `/shop?category=${encodeURIComponent(category)}`
    );
  };

  if (loading) {
    return (
      <section className="categories-page">
        <h1>Shop By Category</h1>
        <p>Loading categories...</p>
      </section>
    );
  }

  return (
    <section className="categories-page">

      <h1>Shop By Category</h1>

      <div className="category-grid">

        {categories.map((category) => {

          const categoryProducts = products.filter(
            (item) => item.category === category
          );

          return (
            <div
              className="category-card"
              key={category}
              onClick={() => openCategory(category)}
            >
              <h2>{category}</h2>

              <p>
                {categoryProducts.length} Products
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openCategory(category);
                }}
              >
                Explore Category
              </button>
            </div>
          );
        })}

      </div>

    </section>
  );
}

export default Categories;