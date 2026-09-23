import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ShoppingAI.css";

const AI_API_URL =
    "https://shopping-world-react.onrender.com/api/ai/chat";

const initialMessages = [
    {
        type: "ai",
        text: "Hi! 👋 I'm Shopping World AI. Ask me anything."
    }
];

function ShoppingAI() {
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState(initialMessages);

    const resetChat = () => {
        setMessages(initialMessages);
        setMessage("");
        setLoading(false);
    };

    const newChat = () => {
        resetChat();
    };

    const addToCart = (product) => {
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

        setMessages((previous) => [
            ...previous,
            {
                type: "ai",
                text: `${product.name} has been added to your cart 🛒`
            }
        ]);
    };

    const sendMessage = async (customMessage = null) => {
        const text = (
            customMessage !== null
                ? customMessage
                : message
        ).trim();

        if (!text || loading) {
            return;
        }

        const userMessage = {
            type: "user",
            text
        };

        const updatedMessages = [
            ...messages,
            userMessage
        ];

        setMessages(updatedMessages);
        setMessage("");
        setLoading(true);

        try {
            const history = updatedMessages
                .filter(
                    (item) =>
                        item.type === "user" ||
                        item.type === "ai"
                )
                .slice(-12)
                .map((item) => ({
                    role:
                        item.type === "user"
                            ? "user"
                            : "assistant",
                    content: item.text
                }));

            const response = await fetch(
                AI_API_URL,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        message: text,
                        history
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    data.message ||
                    `AI request failed with status ${response.status}`
                );
            }

            const answer =
                data.reply ||
                data.message ||
                "Sorry, I couldn't generate a response.";

            setMessages((previous) => [
                ...previous,
                {
                    type: "ai",
                    text: answer,
                    products:
                        Array.isArray(data.products)
                            ? data.products
                            : []
                }
            ]);
        } catch (error) {
            console.error(
                "Shopping AI error:",
                error
            );

            setMessages((previous) => [
                ...previous,
                {
                    type: "ai",
                    text: `AI Error: ${error.message}`
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestion = (text) => {
        sendMessage(text);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <>
            <button
                className={`shopping-ai-button ${
                    open
                        ? "shopping-ai-button-open"
                        : ""
                }`}
                onClick={() => setOpen(!open)}
                aria-label="Open Shopping AI"
            >
                {open ? "×" : "✨"}
            </button>

            {open && (
                <div className="shopping-ai-window">
                    <div className="shopping-ai-header">
                        <div className="shopping-ai-title">
                            <div className="shopping-ai-icon">
                                ✨
                            </div>

                            <div>
                                <h3>
                                    Shopping AI
                                </h3>

                                <span>
                                    ● Online
                                </span>
                            </div>
                        </div>

                        <div className="shopping-ai-header-actions">
                            <button
                                className="shopping-ai-action"
                                onClick={newChat}
                                title="New Chat"
                            >
                                ＋
                            </button>

                            <button
                                className="shopping-ai-action"
                                onClick={resetChat}
                                title="Refresh Chat"
                            >
                                ↻
                            </button>

                            <button
                                className="shopping-ai-close"
                                onClick={() =>
                                    setOpen(false)
                                }
                                title="Close"
                            >
                                ×
                            </button>
                        </div>
                    </div>

                    <div className="shopping-ai-messages">
                        {messages.map(
                            (item, index) => (
                                <div
                                    key={index}
                                    className={`shopping-ai-message ${
                                        item.type ===
                                        "user"
                                            ? "shopping-ai-user-message"
                                            : "shopping-ai-ai-message"
                                    }`}
                                >
                                    {item.type ===
                                        "ai" && (
                                        <div className="shopping-ai-avatar">
                                            ✨
                                        </div>
                                    )}

                                    <div className="shopping-ai-content">
                                        <div className="shopping-ai-bubble">
                                            {item.text}
                                        </div>

                                        {item.products &&
                                            item.products.length >
                                                0 && (
                                                <div className="shopping-ai-products">
                                                    {item.products.map(
                                                        (
                                                            product
                                                        ) => (
                                                            <div
                                                                className="shopping-ai-product"
                                                                key={
                                                                    product.id
                                                                }
                                                            >
                                                                <img
                                                                    src={
                                                                        product.image
                                                                    }
                                                                    alt={
                                                                        product.name
                                                                    }
                                                                />

                                                                <div className="shopping-ai-product-info">
                                                                    <h4>
                                                                        {
                                                                            product.name
                                                                        }
                                                                    </h4>

                                                                    <div className="shopping-ai-product-rating">
                                                                        ⭐{" "}
                                                                        {
                                                                            product.rating
                                                                        }
                                                                    </div>

                                                                    <strong>
                                                                        ₹
                                                                        {Number(
                                                                            product.price ||
                                                                                0
                                                                        ).toLocaleString(
                                                                            "en-IN"
                                                                        )}
                                                                    </strong>

                                                                    <div className="shopping-ai-product-buttons">
                                                                        <button
                                                                            onClick={() =>
                                                                                navigate(
                                                                                    `/product/${encodeURIComponent(
                                                                                        product.name
                                                                                    )}`
                                                                                )
                                                                            }
                                                                        >
                                                                            View
                                                                        </button>

                                                                        <button
                                                                            onClick={() =>
                                                                                addToCart(
                                                                                    product
                                                                                )
                                                                            }
                                                                        >
                                                                            🛒
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                </div>
                            )
                        )}

                        {loading && (
                            <div className="shopping-ai-message shopping-ai-ai-message">
                                <div className="shopping-ai-avatar">
                                    ✨
                                </div>

                                <div className="shopping-ai-bubble">
                                    Thinking... 🤖
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="shopping-ai-suggestions">
                        <button
                            onClick={() =>
                                handleSuggestion(
                                    "Show me products under ₹2000"
                                )
                            }
                        >
                            💰 Under ₹2000
                        </button>

                        <button
                            onClick={() =>
                                handleSuggestion(
                                    "Suggest gaming products"
                                )
                            }
                        >
                            🎮 Gaming
                        </button>

                        <button
                            onClick={() =>
                                handleSuggestion(
                                    "Show me best rated products"
                                )
                            }
                        >
                            ⭐ Best Rated
                        </button>
                    </div>

                    <div className="shopping-ai-input-area">
                        <input
                            type="text"
                            placeholder="Ask me anything..."
                            value={message}
                            onChange={(event) =>
                                setMessage(
                                    event.target.value
                                )
                            }
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                        />

                        <button
                            onClick={() =>
                                sendMessage()
                            }
                            disabled={
                                !message.trim() ||
                                loading
                            }
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default ShoppingAI;