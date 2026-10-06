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

const normalizeText = (value) =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const removeRepeatedContent = (answer) => {
  let text = String(answer || "").trim();

  if (!text) return "";

  const paragraphs = text
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (paragraphs.length > 1) {
    const uniqueParagraphs = [];

    for (const paragraph of paragraphs) {
      const normalized = normalizeText(paragraph);

      if (
        !uniqueParagraphs.some(
          (existing) =>
            normalizeText(existing) === normalized ||
            normalized.includes(normalizeText(existing)) ||
            normalizeText(existing).includes(normalized)
        )
      ) {
        uniqueParagraphs.push(paragraph);
      }
    }

    text = uniqueParagraphs.join("\n\n");
  }

  const sentences = text
    .split(/(?<=[.!?।])\s+/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (sentences.length > 2) {
    const uniqueSentences = [];

    for (const sentence of sentences) {
      const normalized = normalizeText(sentence);

      if (
        !uniqueSentences.some(
          (existing) =>
            normalizeText(existing) === normalized
        )
      ) {
        uniqueSentences.push(sentence);
      }
    }

    text = uniqueSentences.join(" ");
  }

  const words = text.split(/\s+/);

  if (words.length >= 12 && words.length % 2 === 0) {
    const half = words.length / 2;

    const first = normalizeText(
      words.slice(0, half).join(" ")
    );

    const second = normalizeText(
      words.slice(half).join(" ")
    );

    if (first === second) {
      text = words.slice(0, half).join(" ");
    }
  }

  return text.trim();
};

const cleanAIResponse = (answer, products = []) => {
  if (!answer) {
    return "Sure! Here are some products you may like. 👇";
  }

  let cleaned = removeRepeatedContent(answer);

  if (Array.isArray(products) && products.length > 0) {
    const productNames = products
      .map((product) => product?.name)
      .filter(Boolean)
      .sort((a, b) => b.length - a.length);

    for (const name of productNames) {
      const index = cleaned
        .toLowerCase()
        .indexOf(String(name).toLowerCase());

      if (index !== -1) {
        cleaned = cleaned.slice(0, index).trim();
        break;
      }
    }
  }

  cleaned = cleaned
    .replace(/\n{3,}/g, "\n\n")
    .replace(/(^|\n)#{1,6}\s*$/g, "")
    .trim();

  if (!cleaned || cleaned.length < 8) {
    return "Sure! Here are some products you may like. 👇";
  }

  return cleaned;
};

function ShoppingAI({ fullPage = false }) {
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

  const sendMessage = async () => {
    const text = message.trim();

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
            "Content-Type": "application/json"
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

      const products = Array.isArray(data.products)
        ? data.products
        : [];

      const answer = cleanAIResponse(
        data.reply ||
          data.message ||
          "Sorry, I couldn't generate a response.",
        products
      );

      setMessages((previous) => [
        ...previous,
        {
          type: "ai",
          text: answer,
          products
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
    setMessage(text);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  const renderChat = () => (
    <>
      <div className="shopping-ai-header">
        <div className="shopping-ai-title">
          <div className="shopping-ai-icon">
            ✨
          </div>

          <div>
            <h3>Shopping AI</h3>
            <span>● Online</span>
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

          {!fullPage && (
            <button
              className="shopping-ai-action shopping-ai-full-button"
              onClick={() =>
                navigate("/shopping-ai")
              }
              title="Open Full AI"
              aria-label="Open Full AI"
            >
              ↗
            </button>
          )}

          {!fullPage && (
            <button
              className="shopping-ai-close"
              onClick={() => setOpen(false)}
              title="Close"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="shopping-ai-messages">
        {messages.map((item, index) => (
          <div
            key={`${item.type}-${index}`}
            className={`shopping-ai-message ${
              item.type === "user"
                ? "shopping-ai-user-message"
                : "shopping-ai-ai-message"
            }`}
          >
            {item.type === "ai" && (
              <div className="shopping-ai-avatar">
                ✨
              </div>
            )}

            <div className="shopping-ai-content">
              <div className="shopping-ai-bubble">
                {item.text}
              </div>

              {item.products &&
                item.products.length > 0 && (
                  <div className="shopping-ai-products">
                    {item.products.map((product) => (
                      <div
                        className="shopping-ai-product"
                        key={
                          product.id ||
                          product.name
                        }
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                        />

                        <div className="shopping-ai-product-info">
                          <h4>{product.name}</h4>

                          <div className="shopping-ai-product-rating">
                            ⭐ {product.rating}
                          </div>

                          <strong>
                            ₹
                            {Number(
                              product.price || 0
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
                                addToCart(product)
                              }
                              title="Add to Cart"
                            >
                              🛒
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        ))}

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
            setMessage(event.target.value)
          }
          onKeyDown={handleKeyDown}
          disabled={loading}
        />

        <button
          onClick={sendMessage}
          disabled={!message.trim() || loading}
        >
          ➤
        </button>
      </div>
    </>
  );

  if (fullPage) {
    return (
      <div className="shopping-ai-full-page">
        <div className="shopping-ai-full-shell">
          {renderChat()}
        </div>
      </div>
    );
  }

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
          {renderChat()}
        </div>
      )}
    </>
  );
}

export default ShoppingAI;