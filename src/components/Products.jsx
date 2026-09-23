import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Products.css";
import ProductCard from "./ProductCard";

const API_URL =
  "https://shopping-world-react.onrender.com/api/products";

const categoryMap = {
  "fashion & clothing": [
    "mens-shirts",
    "tops",
    "womens-dresses",
    "womens-bags",
    "womens-jewellery",
    "sunglasses",
    "fragrances",
    "beauty",
    "skin-care"
  ],

  "electronics & gadgets": [
    "smartphones",
    "laptops",
    "tablets",
    "mobile-accessories"
  ],

  footwear: [
    "mens-shoes",
    "womens-shoes"
  ],

  "audio & entertainment": [
    "mobile-accessories"
  ],

  "watches & wearables": [
    "mens-watches",
    "womens-watches"
  ],

  "home & living": [
    "furniture",
    "home-decoration",
    "kitchen-accessories"
  ]
};

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ");
}

function getSearchWords(text) {
  return normalizeText(text)
    .split(" ")
    .filter((word) => word.length > 0);
}

function Products({
  search = "",
  category = "",
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

        if (!Array.isArray(data)) {
          throw new Error("Invalid products data");
        }

        setProducts(data);
      } catch (error) {
        console.error("PRODUCT FETCH ERROR:", error);

        setError(
          "Products load nahi ho paaye. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const searchText = normalizeText(search);
  const searchWords = getSearchWords(search);
  const categoryText = normalizeText(category);

  const selectedCategories =
    categoryMap[categoryText] || [];

  const normalizedSelectedCategories =
    selectedCategories.map((item) =>
      normalizeText(item)
    );

  let filteredProducts = products.filter((item) => {
    const productName = normalizeText(item.name);
    const productCategory = normalizeText(item.category);
    const productBrand = normalizeText(item.brand);
    const productDescription = normalizeText(
      item.description
    );

    const searchableText = normalizeText(
      `${productName} ${productCategory} ${productBrand} ${productDescription}`
    );

    const matchesSearch =
      !searchText ||
      searchWords.every((word) =>
        searchableText.includes(word)
      );

    const matchesCategory =
      !categoryText ||
      normalizedSelectedCategories.includes(
        productCategory
      );

    return matchesSearch && matchesCategory;
  });

  if (limit !== null && Number(limit) > 0) {
    filteredProducts = [...filteredProducts]
      .sort((a, b) => {
        const ratingA =
          Number(a.rating) || 0;

        const ratingB =
          Number(b.rating) || 0;

        return ratingB - ratingA;
      })
      .slice(0, Number(limit));
  }

  const openProduct = (productName) => {
    navigate(
      `/product/${encodeURIComponent(productName)}`
    );
  };

  return (
    <section className="products">

      {title && (
        <h2>{title}</h2>
      )}

      {loading && (
        <div className="products-message">
          <h2>Loading Products...</h2>
        </div>
      )}

      {!loading && error && (
        <div className="products-message">
          <h2>{error}</h2>
        </div>
      )}

      {!loading && !error && (
        <>
          {filteredProducts.length > 0 ? (
            <div className="product-grid">

              {filteredProducts.map((item) => (
                <div
                  key={item.id}
                  className="product-click-wrapper"
                  onClick={() =>
                    openProduct(item.name)
                  }
                >
                  <ProductCard
                    image={item.image}
                    name={item.name}
                    price={
                      typeof item.price === "number"
                        ? `₹${item.price.toLocaleString(
                            "en-IN"
                          )}`
                        : item.price
                    }
                    rating={item.rating}
                  />
                </div>
              ))}

            </div>
          ) : (
            <div className="products-message">

              <h2>
                No Products Found 😔
              </h2>

              {search && (
                <p>
                  No products found for{" "}
                  <strong>"{search}"</strong>.
                </p>
              )}

              {category && !search && (
                <p>
                  No products available in{" "}
                  <strong>{category}</strong>.
                </p>
              )}

            </div>
          )}
        </>
      )}

    </section>
  );
}

export default Products;