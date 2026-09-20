import { useSearchParams } from "react-router-dom";
import Products from "../components/Products";
import "./Shop.css";

function Shop() {
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category");

  return (
    <section className="shop-page">

      <div className="shop-heading">
        <span>SHOPPING WORLD</span>

        <h1>
          {category
            ? `${category} Products`
            : "Shop All Products"}
        </h1>

        <p>
          {category
            ? `Explore all products from ${category}`
            : "Explore our complete collection of products"}
        </p>
      </div>

      <Products
        search={category || ""}
        limit={null}
        title=""
      />

    </section>
  );
}

export default Shop;