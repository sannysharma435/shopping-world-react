export const categories = [
  {
    name: "Fashion & Clothing",
    icon: "👕",
    description: "Clothes, bags, jewellery & fashion",
    tag: "Clothing & Fashion",
    products: [
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
    tag: "Smart Technology",
    products: [
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
    tag: "Shoes & Footwear",
    products: [
      "mens-shoes",
      "womens-shoes"
    ]
  },
  {
    name: "Audio & Entertainment",
    icon: "🎧",
    description: "Audio products & entertainment",
    tag: "Music & Entertainment",
    products: [
      "mobile-accessories"
    ]
  },
  {
    name: "Watches & Wearables",
    icon: "⌚",
    description: "Watches & smart wearables",
    tag: "Time & Smart Wear",
    products: [
      "mens-watches",
      "womens-watches"
    ]
  },
  {
    name: "Home & Living",
    icon: "🏠",
    description: "Furniture, decor & kitchen essentials",
    tag: "Home Essentials",
    products: [
      "furniture",
      "home-decoration",
      "kitchen-accessories"
    ]
  },
  {
    name: "Beauty & Personal Care",
    icon: "✨",
    description: "Beauty, skincare & fragrances",
    tag: "Beauty & Care",
    products: [
      "beauty",
      "skin-care",
      "fragrances"
    ]
  },
  {
    name: "Grocery & Daily Needs",
    icon: "🛒",
    description: "Groceries & everyday essentials",
    tag: "Daily Essentials",
    products: [
      "groceries"
    ]
  },
  {
    name: "Vehicles & Motors",
    icon: "🏍️",
    description: "Motorcycles & automotive products",
    tag: "Automotive",
    products: [
      "motorcycle"
    ]
  }
];

export function normalizeCategory(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ");
}

export function getCategoryByName(name) {
  const normalizedName = normalizeCategory(name);

  return categories.find(
    (category) =>
      normalizeCategory(category.name) === normalizedName
  );
}