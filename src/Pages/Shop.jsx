import { useSearchParams } from "react-router-dom";
import Products from "../components/Products";
import "./Shop.css";

function Shop({ search = "" }) {
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category");
  const querySearch = searchParams.get("search") || search;

  return (
    <section className="shop-page">

      <div className="shop-heading">

        <span>
          SHOPPING WORLD HUB
        </span>

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
        search={querySearch}
        category={category || ""}
        limit={null}
        title=""
        showControls={true}
      />

    </section>
  );
}

export default Shop;