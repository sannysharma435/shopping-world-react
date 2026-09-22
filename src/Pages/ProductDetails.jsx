import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./ProductDetails.css";
import Toast from "../components/Toast";
import BuyNowModal from "../components/BuyNowModal";

const API_URL =
    "https://shopping-world-react.onrender.com/api/products";

function ProductDetails() {
    const { name } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showBuyModal, setShowBuyModal] = useState(false);

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
            } catch (error) {
                console.error("Product fetch error:", error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [name]);

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

        const cart =
            JSON.parse(
                localStorage.getItem("shoppingWorldCart")
            ) || [];

        const existingProduct = cart.find(
            (item) => item.name === product.name
        );

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                image: product.image,
                name: product.name,
                price: product.price,
                rating: product.rating,
                category: product.category,
                quantity: 1
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

        setShowBuyModal(true);
    };

    const closeBuyNow = () => {
        setShowBuyModal(false);
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
                    />

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

                    {product.delivery && (
                        <p className="details-delivery">
                            🚚 {product.delivery}
                        </p>
                    )}

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
        </>
    );
}

export default ProductDetails;