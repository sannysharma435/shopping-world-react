import { useNavigate } from "react-router-dom";
import products from "../data/products";
import "./Categories.css";

function Categories() {
  const navigate = useNavigate();

  const categories = [
    ...new Set(products.map((item) => item.category))
  ];

  const openCategory = (category) => {
    navigate(`/shop?category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="categories-page">

      <h1>Shop By Category</h1>

      <div className="category-grid">

        {categories.map((category, index) => {

          const categoryProducts = products.filter(
            (item) => item.category === category
          );

          return (
            <div
              className="category-card"
              key={index}
              onClick={() => openCategory(category)}
            >
              <h2>{category}</h2>

              <p>
                {categoryProducts.length} Products
              </p>

              <button>
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