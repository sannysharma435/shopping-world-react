import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Categories.css";

const API_URL =
  "https://shopping-world-react.onrender.com/api/products";

const categoryGroups = [
  {
    name: "Fashion & Clothing",
    icon: "👕",
    description: "Clothes, bags, jewellery & fashion",
    categories: [
      "mens-shirts",
      "tops",
      "womens-dresses",
      "womens-bags",
      "womens-jewellery",
      "sunglasses"
    ]
  },
  {
    name: "Electronics & Gadgets",
    icon: "📱",
    description: "Mobiles, laptops, tablets & gadgets",
    categories: [
      "smartphones",
      "laptops",
      "tablets",
      "mobile-accessories"
    ]
  },
  {
    name: "Footwear",
    icon: "👟",
    description: "Shoes & footwear for everyone",
    categories: [
      "mens-shoes",
      "womens-shoes"
    ]
  },
  {
    name: "Audio & Entertainment",
    icon: "🎧",
    description: "Audio products & entertainment",
    categories: [
      "mobile-accessories"
    ]
  },
  {
    name: "Watches & Wearables",
    icon: "⌚",
    description: "Watches & smart wearables",
    categories: [
      "mens-watches",
      "womens-watches"
    ]
  },
  {
    name: "Home & Living",
    icon: "🏠",
    description: "Furniture, decor & kitchen essentials",
    categories: [
      "furniture",
      "home-decoration",
      "kitchen-accessories"
    ]
  },
  {
    name: "Beauty & Personal Care",
    icon: "✨",
    description: "Beauty, skincare & fragrances",
    categories: [
      "beauty",
      "skin-care",
      "fragrances"
    ]
  },
  {
    name: "Grocery & Daily Needs",
    icon: "🛒",
    description: "Groceries & everyday essentials",
    categories: [
      "groceries"
    ]
  },
  {
    name: "Vehicles & Motors",
    icon: "🏍️",
    description: "Motorcycles & automotive products",
    categories: [
      "motorcycle"
    ]
  }
];

function normalizeCategory(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

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

        if (!Array.isArray(data)) {
          throw new Error("Invalid products data");
        }

        setProducts(data);
      } catch (error) {
        console.error("CATEGORY FETCH ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getProductCount = (categoryList) => {
    return products.filter((product) =>
      categoryList.includes(
        normalizeCategory(product.category)
      )
    ).length;
  };

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

      <div className="categories-heading">
        <span>
          SHOPPING WORLD
        </span>

        <h1>
          Shop By Category
        </h1>

        <p>
          Explore products across every part of
          your lifestyle
        </p>
      </div>

      <div className="category-grid">

        {categoryGroups.map((category) => {

          const productCount =
            getProductCount(category.categories);

          return (
            <div
              className="category-card"
              key={category.name}
              onClick={() =>
                openCategory(category.name)
              }
            >

              <div className="category-icon">
                {category.icon}
              </div>

              <h2>
                {category.name}
              </h2>

              <p>
                {category.description}
              </p>

              <span className="category-product-count">
                {productCount} Products
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openCategory(category.name);
                }}
              >
                Explore Category →
              </button>

            </div>
          );
        })}

      </div>

    </section>
  );
}

export default Categories;