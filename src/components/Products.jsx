import { useEffect, useMemo, useState } from "react";
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
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getWords(text) {
  return normalizeText(text)
    .split(" ")
    .filter((word) => word.length > 0);
}

function singularize(word) {
  if (word.length <= 3) {
    return word;
  }

  if (word.endsWith("ies")) {
    return word.slice(0, -3) + "y";
  }

  if (word.endsWith("ves")) {
    return word.slice(0, -3) + "f";
  }

  if (word.endsWith("es")) {
    return word.slice(0, -2);
  }

  if (word.endsWith("s")) {
    return word.slice(0, -1);
  }

  return word;
}

function levenshteinDistance(first, second) {
  const a = String(first);
  const b = String(second);

  const matrix = Array.from(
    { length: a.length + 1 },
    () => Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) {
    matrix[i][0] = i;
  }

  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost =
        a[i - 1] === b[j - 1] ? 0 : 1;

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

function wordsRelated(searchWord, productWords) {
  const normalizedSearch = singularize(searchWord);

  for (const productWord of productWords) {
    const normalizedProduct = singularize(productWord);

    if (
      normalizedProduct === normalizedSearch
    ) {
      return 100;
    }

    if (
      normalizedProduct.includes(normalizedSearch) ||
      normalizedSearch.includes(normalizedProduct)
    ) {
      return 80;
    }

    if (
      normalizedSearch.length >= 4 &&
      normalizedProduct.length >= 4
    ) {
      const distance = levenshteinDistance(
        normalizedSearch,
        normalizedProduct
      );

      const allowedDistance =
        normalizedSearch.length >= 7
          ? 2
          : 1;

      if (distance <= allowedDistance) {
        return 60;
      }
    }
  }

  return 0;
}

function getProductScore(product, searchWords) {
  if (!searchWords.length) {
    return 0;
  }

  const nameWords = getWords(product.name);
  const categoryWords = getWords(product.category);
  const brandWords = getWords(product.brand);
  const descriptionWords = getWords(
    product.description
  );

  const allWords = [
    ...nameWords,
    ...categoryWords,
    ...brandWords,
    ...descriptionWords
  ];

  let totalScore = 0;
  let matchedWords = 0;

  searchWords.forEach((searchWord) => {
    const nameScore = wordsRelated(
      searchWord,
      nameWords
    );

    const categoryScore = wordsRelated(
      searchWord,
      categoryWords
    );

    const brandScore = wordsRelated(
      searchWord,
      brandWords
    );

    const descriptionScore = wordsRelated(
      searchWord,
      descriptionWords
    );

    const bestScore = Math.max(
      nameScore,
      categoryScore,
      brandScore,
      descriptionScore
    );

    if (bestScore > 0) {
      matchedWords += 1;

      if (nameScore > 0) {
        totalScore += nameScore + 40;
      } else if (brandScore > 0) {
        totalScore += brandScore + 25;
      } else if (categoryScore > 0) {
        totalScore += categoryScore + 20;
      } else {
        totalScore += descriptionScore;
      }
    }
  });

  const fullText = normalizeText(
    `${product.name} ${product.category} ${product.brand} ${product.description}`
  );

  const fullSearch = normalizeText(
    searchWords.join(" ")
  );

  if (
    fullSearch.length > 1 &&
    fullText.includes(fullSearch)
  ) {
    totalScore += 100;
  }

  const matchRatio =
    matchedWords / searchWords.length;

  if (matchRatio === 1) {
    totalScore += 100;
  } else if (matchRatio >= 0.5) {
    totalScore += 30;
  }

  if (allWords.length === 0) {
    return 0;
  }

  return totalScore;
}

function shuffleProducts(items) {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(
      Math.random() * (i + 1)
    );

    [shuffled[i], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[i]
    ];
  }

  return shuffled;
}

function Products({
  search = "",
  category = "",
  limit = null,
  title = "Featured Products",
  randomize = false
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
        console.error(
          "PRODUCT FETCH ERROR:",
          error
        );

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

  const searchResults = useMemo(() => {
    const searchWords = getWords(search);

    if (!searchWords.length) {
      return products;
    }

    return products
      .map((product) => ({
        product,
        score: getProductScore(
          product,
          searchWords
        )
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.product);
  }, [products, search]);

  const categoryData = getCategoryByName(category);

  let filteredProducts = searchResults.filter(
    (item) => {
      const productCategory =
        normalizeCategory(item.category);

      if (!category) {
        return true;
      }

      if (categoryData) {
        return categoryData.products.some(
          (categoryName) =>
            normalizeCategory(categoryName) ===
            productCategory
        );
      }

      return (
        productCategory ===
        normalizeCategory(category)
      );
    }
  );

  if (limit !== null && Number(limit) > 0) {
    if (randomize && !search) {
      filteredProducts = shuffleProducts(
        filteredProducts
      ).slice(0, Number(limit));
    } else {
      filteredProducts = filteredProducts.slice(
        0,
        Number(limit)
      );
    }
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
                  No products related to{" "}
                  <strong>"{search}"</strong>{" "}
                  were found.
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