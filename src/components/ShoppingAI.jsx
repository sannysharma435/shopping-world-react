import { useEffect, useRef, useState } from "react";
import "./ShoppingAI.css";

const AI_API_URL =
  "https://shopping-world-react.onrender.com/api/ai/chat";

const HISTORY_KEY = "shoppingWorldAIHistory";

function ShoppingAI({ fullPage = false }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [activeMenu, setActiveMenu] = useState("Chat");
  const [activeChatId, setActiveChatId] = useState(null);

  const [chatHistory, setChatHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, loading]);

  const saveHistory = (history) => {
    setChatHistory(history);

    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(history)
    );
  };

  const createChatId = () => {
    return `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
  };

  const getChatTitle = (chatMessages) => {
    const firstUserMessage = chatMessages.find(
      (item) => item.role === "user"
    );

    if (!firstUserMessage?.content) {
      return "New Chat";
    }

    return firstUserMessage.content
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 38);
  };

  const updateCurrentChat = (
    chatMessages,
    chatId = activeChatId
  ) => {
    if (!chatMessages.length) {
      return;
    }

    const finalChatId =
      chatId || createChatId();

    if (!activeChatId) {
      setActiveChatId(finalChatId);
    }

    const currentHistory = JSON.parse(
      localStorage.getItem(HISTORY_KEY) || "[]"
    );

    const existingChat = currentHistory.find(
      (chat) => chat.id === finalChatId
    );

    const updatedChat = {
      id: finalChatId,
      title:
        existingChat?.title ||
        getChatTitle(chatMessages),
      messages: chatMessages,
      updatedAt: Date.now()
    };

    const updatedHistory = existingChat
      ? currentHistory.map((chat) =>
          chat.id === finalChatId
            ? updatedChat
            : chat
        )
      : [updatedChat, ...currentHistory];

    saveHistory(updatedHistory);
  };

  const startNewChat = () => {
    setMessages([]);
    setProducts([]);
    setMessage("");
    setLoading(false);
    setActiveChatId(null);
    setActiveMenu("Chat");
  };

  const openChat = (chat) => {
    setActiveChatId(chat.id);
    setMessages(chat.messages || []);
    setProducts([]);
    setMessage("");
    setLoading(false);
    setActiveMenu("Chat");
  };

  const clearHistory = () => {
    setChatHistory([]);
    setMessages([]);
    setProducts([]);
    setMessage("");
    setActiveChatId(null);

    localStorage.removeItem(HISTORY_KEY);
  };

  const addToCart = (product) => {
    const existingCart = JSON.parse(
      localStorage.getItem(
        "shoppingWorldCart"
      ) || "[]"
    );

    const existingIndex =
      existingCart.findIndex(
        (item) =>
          item.id === product.id ||
          item.name === product.name
      );

    if (existingIndex >= 0) {
      existingCart[existingIndex].quantity =
        (existingCart[existingIndex].quantity ||
          1) + 1;
    } else {
      existingCart.push({
        ...product,
        quantity: 1
      });
    }

    localStorage.setItem(
      "shoppingWorldCart",
      JSON.stringify(existingCart)
    );

    window.dispatchEvent(
      new Event(
        "shoppingWorldCartUpdated"
      )
    );
  };

  const openFullAI = () => {
    window.open(
      "/shopping-ai",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const sendMessage = async () => {
    const text = message.trim();

    if (!text || loading) {
      return;
    }

    const userMessage = {
      role: "user",
      content: text
    };

    const updatedMessages = [
      ...messages,
      userMessage
    ];

    let chatId = activeChatId;

    if (!chatId) {
      chatId = createChatId();
      setActiveChatId(chatId);
    }

    setMessages(updatedMessages);
    setMessage("");
    setLoading(true);
    setProducts([]);

    updateCurrentChat(
      updatedMessages,
      chatId
    );

    try {
      const history = messages.map(
        (item) => ({
          role: item.role,
          content: item.content
        })
      );

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

      if (!response.ok) {
        throw new Error(
          `Request failed: ${response.status}`
        );
      }

      const data =
        await response.json();

      const reply =
        data.reply ||
        data.answer ||
        data.message ||
        "Sorry, I couldn't find an answer.";

      const finalMessages = [
        ...updatedMessages,
        {
          role: "assistant",
          content: reply
        }
      ];

      setMessages(finalMessages);

      updateCurrentChat(
        finalMessages,
        chatId
      );

      if (Array.isArray(data.products)) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error(
        "Shopping AI Error:",
        error
      );

      const errorMessage = {
        role: "assistant",
        content:
          "Sorry, I am having trouble connecting right now. Please try again."
      };

      const finalMessages = [
        ...updatedMessages,
        errorMessage
      ];

      setMessages(finalMessages);

      updateCurrentChat(
        finalMessages,
        chatId
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (content) => {
    if (!content) {
      return null;
    }

    return content
      .split(/\n\s*\n/)
      .map((paragraph, index) => (
        <p key={index}>
          {paragraph}
        </p>
      ));
  };

  const sortedHistory = [
    ...chatHistory
  ].sort(
    (a, b) =>
      (b.updatedAt || 0) -
      (a.updatedAt || 0)
  );

  if (fullPage) {
    return (
      <div className="shopping-ai-page">
        <aside className="shopping-ai-sidebar">
          <div className="ai-sidebar-brand">
            <div className="ai-brand-icon">
              ✦
            </div>

            <div>
              <strong>
                Shopping World
              </strong>

              <span>
                AI Assistant
              </span>
            </div>
          </div>

          <button
            className="ai-new-chat"
            onClick={startNewChat}
          >
            <span>＋</span>
            New Chat
          </button>

          <div className="ai-sidebar-section">
            <span className="ai-sidebar-label">
              WORKSPACE
            </span>

            <button
              className={`ai-sidebar-item ${
                activeMenu === "Chat"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveMenu("Chat")
              }
            >
              <span>◈</span>
              AI Chat
            </button>

            <button
              className={`ai-sidebar-item ${
                activeMenu === "Explore"
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setActiveMenu("Explore");
                setMessage(
                  "Show me popular products"
                );
              }}
            >
              <span>⌕</span>
              Explore Products
            </button>

            <button
              className={`ai-sidebar-item ${
                activeMenu === "Compare"
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setActiveMenu("Compare");
                setMessage(
                  "Help me compare products"
                );
              }}
            >
              <span>⇄</span>
              Compare
            </button>
          </div>

          <div className="ai-sidebar-section ai-history-section">
            <div className="ai-history-header">
              <span className="ai-sidebar-label">
                CHAT HISTORY
              </span>

              {sortedHistory.length > 0 && (
                <button
                  className="ai-clear-history"
                  onClick={
                    clearHistory
                  }
                >
                  Clear
                </button>
              )}
            </div>

            <div className="ai-history-list">
              {sortedHistory.length ===
              0 ? (
                <div className="ai-empty-history">
                  <span>◷</span>

                  <p>
                    No conversations yet
                  </p>

                  <small>
                    Your AI chats will
                    appear here
                  </small>
                </div>
              ) : (
                sortedHistory.map(
                  (chat) => (
                    <button
                      key={chat.id}
                      className={`ai-history-item ${
                        activeChatId ===
                        chat.id
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        openChat(chat)
                      }
                    >
                      <span className="history-icon">
                        ◈
                      </span>

                      <span className="history-content">
                        <strong>
                          {chat.title ||
                            "New Chat"}
                        </strong>

                        <small>
                          {chat.messages
                            ?.length ||
                            0}{" "}
                          messages
                        </small>
                      </span>
                    </button>
                  )
                )
              )}
            </div>
          </div>

          <div className="ai-sidebar-bottom">
            <button
              className="ai-back-store"
              onClick={() =>
                window.open(
                  "/",
                  "_blank"
                )
              }
            >
              <span>←</span>
              Back to Shopping World
            </button>
          </div>
        </aside>

        <main className="shopping-ai-main">
          <header className="ai-main-header">
            <div className="ai-header-title">
              <div className="ai-header-icon">
                ✦
              </div>

              <div>
                <h2>
                  Shopping AI
                </h2>

                <span>
                  <i></i>
                  Online
                </span>
              </div>
            </div>

            <div className="ai-header-actions">
              <button
                title="New chat"
                onClick={
                  startNewChat
                }
              >
                ＋
              </button>

              <button
                title="Refresh"
                onClick={() =>
                  window.location.reload()
                }
              >
                ↻
              </button>
            </div>
          </header>

          <div className="ai-chat-area">
            {messages.length === 0 ? (
              <div className="ai-welcome">
                <div className="ai-welcome-orb">
                  <div>✦</div>
                </div>

                <span className="ai-eyebrow">
                  SHOPPING WORLD AI
                </span>

                <h1>
                  What are you{" "}
                  <span>
                    looking for?
                  </span>
                </h1>

                <p>
                  Discover products,
                  compare options and
                  find the right choice
                  with AI.
                </p>

                <div className="ai-welcome-features">
                  <div>
                    <span>⌕</span>
                    Smart Search
                  </div>

                  <div>
                    <span>⇄</span>
                    Compare Products
                  </div>

                  <div>
                    <span>★</span>
                    Best Recommendations
                  </div>
                </div>
              </div>
            ) : (
              <div className="ai-conversation">
                {messages.map(
                  (item, index) => (
                    <div
                      key={index}
                      className={`ai-message-row ${
                        item.role ===
                        "user"
                          ? "user"
                          : "assistant"
                      }`}
                    >
                      {item.role ===
                        "assistant" && (
                        <div className="ai-message-avatar">
                          ✦
                        </div>
                      )}

                      <div className="ai-message-bubble">
                        {formatMessage(
                          item.content
                        )}
                      </div>
                    </div>
                  )
                )}

                {loading && (
                  <div className="ai-message-row assistant">
                    <div className="ai-message-avatar">
                      ✦
                    </div>

                    <div className="ai-message-bubble typing">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}

                {products.length >
                  0 && (
                  <div className="ai-products-section">
                    <div className="ai-products-heading">
                      <div>
                        <span>
                          AI RECOMMENDATIONS
                        </span>

                        <h3>
                          Products picked
                          for you
                        </h3>
                      </div>

                      <small>
                        {
                          products.length
                        }{" "}
                        results
                      </small>
                    </div>

                    <div className="ai-product-grid">
                      {products.map(
                        (
                          product,
                          index
                        ) => (
                          <div
                            className="ai-product-card"
                            key={
                              product.id ||
                              product.name ||
                              index
                            }
                          >
                            <div className="ai-product-image">
                              {product.image ||
                              product.image_url ? (
                                <img
                                  src={
                                    product.image ||
                                    product.image_url
                                  }
                                  alt={
                                    product.name ||
                                    "Product"
                                  }
                                />
                              ) : (
                                <div>
                                  🛍️
                                </div>
                              )}
                            </div>

                            <div className="ai-product-info">
                              <span className="ai-product-category">
                                {product.category ||
                                  "Product"}
                              </span>

                              <h4>
                                {product.name ||
                                  "Product"}
                              </h4>

                              <div className="ai-product-meta">
                                <strong>
                                  ₹
                                  {product.price ??
                                    "N/A"}
                                </strong>

                                {product.rating && (
                                  <span>
                                    ★{" "}
                                    {
                                      product.rating
                                    }
                                  </span>
                                )}
                              </div>

                              <div className="ai-product-actions">
                                <button
                                  onClick={() => {
                                    if (
                                      product.url
                                    ) {
                                      window.open(
                                        product.url,
                                        "_blank"
                                      );
                                    } else if (
                                      product.name
                                    ) {
                                      window.open(
                                        `/product/${encodeURIComponent(
                                          product.name
                                        )}`,
                                        "_blank"
                                      );
                                    }
                                  }}
                                >
                                  View
                                </button>

                                <button
                                  className="add"
                                  onClick={() =>
                                    addToCart(
                                      product
                                    )
                                  }
                                >
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                <div
                  ref={
                    messagesEndRef
                  }
                />
              </div>
            )}
          </div>

          <div className="ai-input-area">
            <div className="ai-input-wrapper">
              <span className="ai-input-sparkle">
                ✦
              </span>

              <textarea
                value={message}
                onChange={(event) =>
                  setMessage(
                    event.target.value
                  )
                }
                onKeyDown={
                  handleKeyDown
                }
                placeholder="Ask Shopping AI anything..."
                rows="1"
              />

              <button
                className="ai-send-button"
                onClick={
                  sendMessage
                }
                disabled={
                  !message.trim() ||
                  loading
                }
              >
                ➤
              </button>
            </div>

            <p className="ai-disclaimer">
              Shopping AI can make
              mistakes. Always verify
              product details before
              purchasing.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      {!open && (
        <button
          className="shopping-ai-floating-button"
          onClick={() => setOpen(true)}
          aria-label="Open Shopping AI"
        >
          ✦
        </button>
      )}

      {open && (
        <div className="shopping-ai-popup">
          <div className="shopping-ai-popup-header">
            <div className="shopping-ai-popup-brand">
              <div>✦</div>

              <section>
                <strong>
                  Shopping AI
                </strong>

                <span>
                  <i></i>
                  Online
                </span>
              </section>
            </div>

            <div className="shopping-ai-popup-actions">
              <button
                onClick={
                  openFullAI
                }
              >
                ↗
              </button>

              <button
                onClick={
                  startNewChat
                }
              >
                ↻
              </button>

              <button
                onClick={() =>
                  setOpen(false)
                }
              >
                ×
              </button>
            </div>
          </div>

          <div className="shopping-ai-popup-body">
            {messages.length === 0 ? (
              <div className="popup-welcome">
                <div>✦</div>

                <h3>
                  What are you
                  looking for?
                </h3>

                <p>
                  Ask me to find
                  products, compare
                  options or recommend
                  something.
                </p>
              </div>
            ) : (
              messages.map(
                (item, index) => (
                  <div
                    key={index}
                    className={`popup-message ${
                      item.role
                    }`}
                  >
                    {formatMessage(
                      item.content
                    )}
                  </div>
                )
              )
            )}

            {loading && (
              <div className="popup-typing">
                AI is thinking...
              </div>
            )}
          </div>

          <div className="shopping-ai-popup-input">
            <input
              value={message}
              onChange={(event) =>
                setMessage(
                  event.target.value
                )
              }
              onKeyDown={
                handleKeyDown
              }
              placeholder="Ask Shopping AI..."
            />

            <button
              onClick={
                sendMessage
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