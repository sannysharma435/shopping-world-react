const API_URL =
  "https://shopping-world-react.onrender.com/api/products";

let productsCache = null;
let productsPromise = null;

export async function getProducts() {
  if (productsCache) {
    return productsCache;
  }

  if (productsPromise) {
    return productsPromise;
  }

  productsPromise = fetch(API_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data)) {
        throw new Error("Invalid products data");
      }

      productsCache = data;

      return data;
    })
    .catch((error) => {
      productsPromise = null;
      throw error;
    });

  return productsPromise;
}

export function clearProductsCache() {
  productsCache = null;
  productsPromise = null;
}