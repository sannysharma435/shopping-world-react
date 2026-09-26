const RECENTLY_VIEWED_KEY = "shoppingWorldRecentlyViewed";

export function initializeRecentActivity() {
  localStorage.removeItem(RECENTLY_VIEWED_KEY);
}

export function getRecentlyViewed() {
  const storedProducts = sessionStorage.getItem(RECENTLY_VIEWED_KEY);

  if (!storedProducts) {
    return [];
  }

  try {
    const products = JSON.parse(storedProducts);

    if (!Array.isArray(products)) {
      throw new Error("Recently viewed data is not an array");
    }

    return products;
  } catch (error) {
    console.error("Unable to read recently viewed products:", error);
    sessionStorage.removeItem(RECENTLY_VIEWED_KEY);
    return [];
  }
}

export function addRecentlyViewed(product) {
  const recentlyViewed = getRecentlyViewed();
  const nextRecentlyViewed = [
    product,
    ...recentlyViewed.filter((item) => item.name !== product.name)
  ].slice(0, 6);

  sessionStorage.setItem(
    RECENTLY_VIEWED_KEY,
    JSON.stringify(nextRecentlyViewed)
  );

  return nextRecentlyViewed;
}
