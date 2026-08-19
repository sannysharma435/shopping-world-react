import ProductCard from "../components/ProductCard";
import products from "../data/products";
import "./Shop.css";

function Shop() {
  return (
    <section className="shop-page">

      <h1>Shop All Products</h1>

      <div className="shop-grid">
        {products.map((item, index) => (
          <ProductCard
            key={index}
            image={item.image}
            name={item.name}
            price={item.price}
            rating={item.rating}
          />
        ))}
      </div>

    </section>
  );
}

export default Shop;