import products from "../data/products";
import "./Categories.css";

function Categories() {

  const categories = [
    ...new Set(products.map((item) => item.category))
  ];

  return (
    <section className="categories-page">

      <h1>Shop By Category</h1>

      <div className="category-grid">
        {categories.map((category, index) => (
          <div className="category-card" key={index}>
            <h2>{category}</h2>
            <p>
              {products.filter(
                (item) => item.category === category
              ).length} Products
            </p>
          </div>
        ))}
      </div>

    </section>
  );
}

export default Categories;