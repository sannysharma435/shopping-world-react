import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Products.css";
import ProductCard from "./ProductCard";
import {
  getCategoryByName,
  normalizeCategory
} from "../data/categories";
import { getProducts } from "../services/productService";

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
    let active = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();

        if (active) {
          setProducts(data);
        }
      } catch (error) {
        console.error("PRODUCT FETCH ERROR:", error);

        if (active) {
          setError(
            "Products load nahi ho paaye. Please try again."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      active = false;
    };
  }, []);

  const searchText = normalizeText(search);
  const searchWords = getSearchWords(search);
  const categoryData = getCategoryByName(category);

  let filteredProducts = products.filter((item) => {
    const productName = normalizeText(item.name);
    const productCategory = normalizeCategory(item.category);
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

    let matchesCategory = true;

    if (category) {
      if (categoryData) {
        matchesCategory =
          categoryData.products.some(
            (categoryName) =>
              normalizeCategory(categoryName) ===
              productCategory
          );
      } else {
        matchesCategory =
          productCategory === normalizeCategory(category);
      }
    }

    return matchesSearch && matchesCategory;
  });

  if (limit !== null && Number(limit) > 0) {
    filteredProducts = [...filteredProducts]
      .sort((a, b) => {
        const ratingA = Number(a.rating) || 0;
        const ratingB = Number(b.rating) || 0;

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
      {title && <h2>{title}</h2>}

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
              <h2>No Products Found 😔</h2>

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