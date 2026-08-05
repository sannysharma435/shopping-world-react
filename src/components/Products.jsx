import "./Products.css";
import ProductCard from "./ProductCard";

function Products() {
  const products = [
    {
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      name: "Nike Air Max",
      price: "₹2,999",
      rating: "4.8",
    },
    {
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      name: "Smart Watch",
      price: "₹4,999",
      rating: "4.6",
    },
    {
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      name: "iPhone",
      price: "₹79,999",
      rating: "4.9",
    },
    {
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      name: "Headphones",
      price: "₹1,999",
      rating: "4.7",
    },
  ];

  return (
    <section className="products">
      <h2>Featured Products</h2>

      <div className="product-grid">
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

export default Products;