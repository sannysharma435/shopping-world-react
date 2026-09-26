import { useEffect, useRef, useState } from "react";
import {
    useParams,
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";
import "./ProductDetails.css";
import Toast from "../components/Toast";
import BuyNowModal from "../components/BuyNowModal";
import { addRecentlyViewed } from "../services/recentActivityService";

const API_URL =
    "https://shopping-world-react.onrender.com/api/products";

function ProductDetails() {
    const { name } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showBuyModal, setShowBuyModal] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isZoomed, setIsZoomed] = useState(false);
    const [pincode, setPincode] = useState("");
    const [pincodeMessage, setPincodeMessage] = useState("");
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewText, setReviewText] = useState("");
    const [reviews, setReviews] = useState([]);
    const resumedAction = useRef(false);

    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success"
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);

                const productName = decodeURIComponent(name || "")
                    .trim()
                    .toLowerCase();

                const response = await fetch(API_URL);

                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }

                const data = await response.json();

                const products = Array.isArray(data)
                    ? data
                    : data.products || [];

                const foundProduct = products.find((item) => {
                    const itemName = String(item.name || "")
                        .trim()
                        .toLowerCase();

                    return itemName === productName;
                });

                setProduct(foundProduct || null);

                if (foundProduct) {
                    const related = products
                        .filter(
                            (item) =>
                                item.name !== foundProduct.name &&
                                item.category === foundProduct.category
                        )
                        .slice(0, 4);

                    setRelatedProducts(related);

                    addRecentlyViewed({
                        id: foundProduct.id,
                        image: foundProduct.image,
                        name: foundProduct.name,
                        price: foundProduct.price,
                        rating: foundProduct.rating
                    });
                }
            } catch (error) {
                console.error("Product fetch error:", error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [name]);

    useEffect(() => {
        if (!product) {
            return;
        }

        const wishlist = JSON.parse(
            localStorage.getItem("shoppingWorldWishlist")
        ) || [];

        setIsWishlisted(
            wishlist.some((item) => item.name === product.name)
        );

        setReviews(
            JSON.parse(
                localStorage.getItem(
                    `shoppingWorldReviews:${product.name}`
                )
            ) || []
        );
    }, [product]);

    useEffect(() => {
        const action = location.state?.resumeAction;

        if (
            !product ||
            resumedAction.current ||
            !action
        ) {
            return;
        }

        const resume = window.setTimeout(() => {
            resumedAction.current = true;

            if (action === "cart") {
                addToCart();
            } else if (action === "buy") {
                buyNow();
            }
        }, 0);

        return () => window.clearTimeout(resume);
    }, [location.state, product]);

    const showToast = (message, type = "success") => {
        setToast({
            show: true,
            message,
            type
        });

        setTimeout(() => {
            setToast({
                show: false,
                message: "",
                type: "success"
            });
        }, 2800);
    };

    const addToCart = () => {
        if (!product) {
            return;
        }

        if (!localStorage.getItem("shoppingWorldUser")) {
            navigate("/login", {
                state: {
                    from: location.pathname,
                    action: "cart",
                    message: "Please login to add products to your cart."
                }
            });
            return;
        }

        const cart =
            JSON.parse(
                localStorage.getItem("shoppingWorldCart")
            ) || [];

        const existingProduct = cart.find(
            (item) => item.name === product.name
        );

        if (existingProduct) {
                existingProduct.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                image: product.image,
                name: product.name,
                price: product.price,
                rating: product.rating,
                category: product.category,
                quantity
            });
        }

        localStorage.setItem(
            "shoppingWorldCart",
            JSON.stringify(cart)
        );

        window.dispatchEvent(
            new Event("cartUpdated")
        );

        showToast(
            `${product.name} added to cart 🛒`,
            "success"
        );
    };

    const buyNow = () => {
        if (!product) {
            return;
        }

        if (!localStorage.getItem("shoppingWorldUser")) {
            navigate("/login", {
                state: {
                    from: location.pathname,
                    action: "buy",
                    message: "Please login to continue to checkout."
                }
            });
            return;
        }

        setShowBuyModal(true);
    };

    const closeBuyNow = () => {
        setShowBuyModal(false);
    };

    const toggleWishlist = () => {
        if (!product) {
            return;
        }

        if (!localStorage.getItem("shoppingWorldUser")) {
            navigate("/login", {
                state: {
                    from: window.location.pathname,
                    message: "Please login to save products to your wishlist."
                }
            });
            return;
        }

        const wishlist = JSON.parse(
            localStorage.getItem("shoppingWorldWishlist")
        ) || [];

        const exists = wishlist.some(
            (item) => item.name === product.name
        );

        const updatedWishlist = exists
            ? wishlist.filter((item) => item.name !== product.name)
            : [
                  ...wishlist,
                  {
                      image: product.image,
                      name: product.name,
                      price: product.price,
                      rating: product.rating
                  }
              ];

        localStorage.setItem(
            "shoppingWorldWishlist",
            JSON.stringify(updatedWishlist)
        );
        window.dispatchEvent(new Event("wishlistUpdated"));
        setIsWishlisted(!exists);
        showToast(
            exists
                ? `${product.name} removed from wishlist`
                : `${product.name} added to wishlist`,
            "wishlist"
        );
    };

    const checkPincode = () => {
        if (!/^[0-9]{6}$/.test(pincode)) {
            setPincodeMessage("Enter a valid 6-digit pincode.");
            return;
        }

        setPincodeMessage("Delivery available to this location.");
    };

    const shareProduct = async () => {
        const shareData = {
            title: product.name,
            text: `Check out ${product.name} on Shopping World`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                showToast("Product link copied", "success");
            }
        } catch (error) {
            if (error.name !== "AbortError") {
                showToast("Unable to share this product", "error");
            }
        }
    };

    const submitReview = (event) => {
        event.preventDefault();

        if (!reviewText.trim()) {
            return;
        }

        const nextReviews = [
            {
                rating: reviewRating,
                text: reviewText.trim(),
                date: new Date().toLocaleDateString("en-IN"),
                helpful: 0
            },
            ...reviews
        ];

        setReviews(nextReviews);
        setReviewText("");
        localStorage.setItem(
            `shoppingWorldReviews:${product.name}`,
            JSON.stringify(nextReviews)
        );
        showToast("Review added", "success");
    };

    const markReviewHelpful = (index) => {
        const nextReviews = reviews.map((review, reviewIndex) =>
            reviewIndex === index
                ? { ...review, helpful: (review.helpful || 0) + 1 }
                : review
        );

        setReviews(nextReviews);
        localStorage.setItem(
            `shoppingWorldReviews:${product.name}`,
            JSON.stringify(nextReviews)
        );
    };

    if (loading) {
        return (
            <div className="product-not-found">
                <h1>Loading Product...</h1>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-not-found">
                <h1>Product Not Found 😔</h1>

                <Link to="/shop">
                    <button>Go Back to Shop</button>
                </Link>
            </div>
        );
    }

    return (
        <>
            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
            />

            {showBuyModal && (
                <BuyNowModal
                    product={product}
                    onClose={closeBuyNow}
                />
            )}

            <div className="product-details">

                <div className="details-image">

                    {product.discount && (
                        <span className="details-discount">
                            {product.discount}
                        </span>
                    )}

                    <img
                        src={product.image}
                        alt={product.name}
                        onClick={() => setIsZoomed(true)}
                    />

                    <button
                        className="image-zoom-button"
                        type="button"
                        onClick={() => setIsZoomed(true)}
                    >
                        ⌕ View larger
                    </button>

                </div>

                <div className="details-info">

                    <p className="details-category">
                        {product.category}
                    </p>

                    <h1>{product.name}</h1>

                    <div className="details-rating">
                        ⭐ {product.rating}

                        {product.reviews && (
                            <span>
                                {" "}
                                ({product.reviews} Reviews)
                            </span>
                        )}
                    </div>

                    <h2 className="details-price">
                        ₹
                        {typeof product.price === "number"
                            ? product.price.toLocaleString("en-IN")
                            : Number(product.price || 0).toLocaleString("en-IN")}
                    </h2>

                    <div className="product-action-row">
                        <button
                            className={
                                isWishlisted
                                    ? "details-wishlist active"
                                    : "details-wishlist"
                            }
                            type="button"
                            onClick={toggleWishlist}
                        >
                            {isWishlisted ? "♥ Saved" : "♡ Wishlist"}
                        </button>

                        <button
                            className="details-share"
                            type="button"
                            onClick={shareProduct}
                        >
                            ↗ Share
                        </button>
                    </div>

                    {product.delivery && (
                        <p className="details-delivery">
                            🚚 {product.delivery}
                        </p>
                    )}

                    <div className="pincode-check">
                        <label htmlFor="product-pincode">
                            Check delivery availability
                        </label>

                        <div>
                            <input
                                id="product-pincode"
                                inputMode="numeric"
                                maxLength="6"
                                placeholder="Enter pincode"
                                value={pincode}
                                onChange={(event) => {
                                    setPincode(event.target.value);
                                    setPincodeMessage("");
                                }}
                            />
                            <button type="button" onClick={checkPincode}>
                                Check
                            </button>
                        </div>

                        {pincodeMessage && (
                            <p className="pincode-message">
                                {pincodeMessage}
                            </p>
                        )}
                    </div>

                    <hr />

                    <h3>Product Description</h3>

                    <p className="details-description">
                        {product.description ||
                            "This is a high-quality product available at Shopping World."}
                    </p>

                    <div className="product-specs">

                        {product.brand && (
                            <div>
                                <strong>Brand</strong>
                                <span>{product.brand}</span>
                            </div>
                        )}

                        {product.color && (
                            <div>
                                <strong>Color</strong>
                                <span>{product.color}</span>
                            </div>
                        )}

                        <div>
                            <strong>Category</strong>
                            <span>{product.category}</span>
                        </div>

                        {product.availability && (
                            <div>
                                <strong>Availability</strong>

                                <span className="stock">
                                    ● {product.availability}
                                </span>
                            </div>
                        )}

                    </div>

                    <div className="details-buttons">

                        <div className="detail-quantity">
                            <span>Quantity</span>
                            <button
                                type="button"
                                onClick={() =>
                                    setQuantity((current) =>
                                        Math.max(1, current - 1)
                                    )
                                }
                            >
                                −
                            </button>
                            <strong>{quantity}</strong>
                            <button
                                type="button"
                                onClick={() =>
                                    setQuantity((current) => current + 1)
                                }
                            >
                                +
                            </button>
                        </div>

                        <button
                            className="details-cart"
                            onClick={addToCart}
                        >
                            🛒 Add to Cart
                        </button>

                        <button
                            className="details-buy"
                            onClick={buyNow}
                        >
                            ⚡ Buy Now
                        </button>

                    </div>

                </div>

            </div>

            <section className="product-reviews-section">
                <div className="reviews-summary">
                    <div>
                        <span className="details-category">CUSTOMER REVIEWS</span>
                        <h2>How shoppers feel</h2>
                    </div>
                    <strong>⭐ {product.rating}</strong>
                </div>

                <form className="review-form" onSubmit={submitReview}>
                    <label htmlFor="review-rating">Your rating</label>
                    <select
                        id="review-rating"
                        value={reviewRating}
                        onChange={(event) =>
                            setReviewRating(Number(event.target.value))
                        }
                    >
                        <option value="5">5 stars</option>
                        <option value="4">4 stars</option>
                        <option value="3">3 stars</option>
                        <option value="2">2 stars</option>
                        <option value="1">1 star</option>
                    </select>
                    <textarea
                        placeholder="Share your experience with this product"
                        value={reviewText}
                        onChange={(event) => setReviewText(event.target.value)}
                        rows="3"
                    />
                    <button type="submit">Add review</button>
                </form>

                <div className="review-list">
                    {reviews.length > 0 ? (
                        reviews.map((review, index) => (
                            <article className="review-card" key={`${review.date}-${index}`}>
                                <div className="review-card-top">
                                    <strong>{"★".repeat(review.rating)}</strong>
                                    <span>{review.date}</span>
                                </div>
                                <p>{review.text}</p>
                                <button type="button" onClick={() => markReviewHelpful(index)}>
                                    Helpful ({review.helpful || 0})
                                </button>
                            </article>
                        ))
                    ) : (
                        <p className="reviews-empty">Be the first to review this product.</p>
                    )}
                </div>
            </section>

            {relatedProducts.length > 0 && (
                <section className="related-products-section">
                    <div className="related-heading">
                        <span className="details-category">YOU MAY ALSO LIKE</span>
                        <h2>Related products</h2>
                    </div>

                    <div className="related-product-grid">
                        {relatedProducts.map((item) => (
                            <Link
                                key={item.id}
                                className="related-product-card"
                                to={`/product/${encodeURIComponent(item.name)}`}
                            >
                                <img src={item.image} alt={item.name} />
                                <div>
                                    <h3>{item.name}</h3>
                                    <span>⭐ {item.rating}</span>
                                    <strong>₹{Number(item.price).toLocaleString("en-IN")}</strong>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {isZoomed && (
                <button
                    className="image-zoom-overlay"
                    type="button"
                    aria-label="Close enlarged product image"
                    onClick={() => setIsZoomed(false)}
                >
                    <img src={product.image} alt={product.name} />
                </button>
            )}
        </>
    );
}

export default ProductDetails;