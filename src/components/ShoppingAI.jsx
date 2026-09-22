import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ShoppingAI.css";

const API_URL =
    "https://shopping-world-react.onrender.com/api/products";

const initialMessages = [
    {
        type: "ai",
        text: "Hi! 👋 I'm Shopping World AI. Tell me what you're looking for."
    }
];

function ShoppingAI() {
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [language, setLanguage] = useState("english");

    const [messages, setMessages] =
        useState(initialMessages);

    const resetChat = () => {
        setMessages([
            {
                type: "ai",
                text: getWelcomeMessage(language)
            }
        ]);

        setMessage("");
        setLoading(false);
    };

    const newChat = () => {
        resetChat();
    };

    const detectLanguage = (text) => {
        const query = text.toLowerCase();

        const hindiWords = [
            "hai",
            "hain",
            "mujhe",
            "mera",
            "meri",
            "mere",
            "chahiye",
            "dikhao",
            "dikhaye",
            "batao",
            "bataiye",
            "karo",
            "karna",
            "kaise",
            "kya",
            "kitna",
            "kitne",
            "ke",
            "andar",
            "se",
            "tak",
            "wala",
            "wali",
            "wale",
            "achha",
            "accha",
            "sasta",
            "mehenga",
            "bhai",
            "please",
            "do",
            "de",
            "chahta",
            "chahti"
        ];

        const bengaliWords = [
            "ami",
            "amar",
            "apni",
            "kemon",
            "chai",
            "dorkar",
            "dekhao",
            "bolun",
            "bhalo",
            "koto",
            "ache",
            "korun"
        ];

        const spanishWords = [
            "quiero",
            "necesito",
            "busco",
            "mostrar",
            "muéstrame",
            "producto",
            "productos",
            "barato",
            "baratos",
            "precio",
            "comprar",
            "dónde",
            "cómo",
            "qué"
        ];

        const frenchWords = [
            "je",
            "veux",
            "cherche",
            "besoin",
            "produit",
            "produits",
            "acheter",
            "prix",
            "montre",
            "bonjour",
            "merci"
        ];

        const germanWords = [
            "ich",
            "möchte",
            "suche",
            "brauche",
            "produkt",
            "produkte",
            "kaufen",
            "preis",
            "zeige",
            "bitte"
        ];

        const countMatches = (words) => {
            return words.filter((word) => {
                const regex = new RegExp(
                    `\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
                    "i"
                );

                return regex.test(query);
            }).length;
        };

        const hindiCount =
            countMatches(hindiWords);

        const bengaliCount =
            countMatches(bengaliWords);

        const spanishCount =
            countMatches(spanishWords);

        const frenchCount =
            countMatches(frenchWords);

        const germanCount =
            countMatches(germanWords);

        const devanagari =
            /[\u0900-\u097F]/.test(text);

        const bengaliScript =
            /[\u0980-\u09FF]/.test(text);

        if (devanagari) {
            return "hindi";
        }

        if (bengaliScript) {
            return "bengali";
        }

        if (hindiCount >= 2) {
            return "hinglish";
        }

        if (bengaliCount >= 2) {
            return "bengali";
        }

        if (spanishCount >= 2) {
            return "spanish";
        }

        if (frenchCount >= 2) {
            return "french";
        }

        if (germanCount >= 2) {
            return "german";
        }

        return "english";
    };

    const getWelcomeMessage = (lang) => {
        const messages = {
            english:
                "Hi! 👋 I'm Shopping World AI. Tell me what you're looking for.",

            hindi:
                "नमस्ते! 👋 मैं Shopping World AI हूँ। आपको क्या खरीदना है बताइए।",

            hinglish:
                "Hi! 👋 Main Shopping World AI hoon. Aapko kya shopping karni hai bataiye.",

            bengali:
                "নমস্কার! 👋 আমি Shopping World AI। আপনি কী খুঁজছেন বলুন।",

            spanish:
                "¡Hola! 👋 Soy Shopping World AI. Dime qué estás buscando.",

            french:
                "Bonjour ! 👋 Je suis Shopping World AI. Dites-moi ce que vous cherchez.",

            german:
                "Hallo! 👋 Ich bin Shopping World AI. Sagen Sie mir, wonach Sie suchen."
        };

        return messages[lang] || messages.english;
    };

    const getResponseMessage = (
        lang,
        resultCount
    ) => {
        if (lang === "hindi") {
            return `मुझे आपके लिए ${resultCount} प्रोडक्ट मिले हैं ✨`;
        }

        if (lang === "hinglish") {
            return `Mujhe aapke liye ${resultCount} products mile hain ✨`;
        }

        if (lang === "bengali") {
            return `আমি আপনার জন্য ${resultCount}টি প্রোডাক্ট পেয়েছি ✨`;
        }

        if (lang === "spanish") {
            return `Encontré ${resultCount} producto${
                resultCount > 1 ? "s" : ""
            } para ti ✨`;
        }

        if (lang === "french") {
            return `J'ai trouvé ${resultCount} produit${
                resultCount > 1 ? "s" : ""
            } pour vous ✨`;
        }

        if (lang === "german") {
            return `Ich habe ${resultCount} Produkt${
                resultCount > 1 ? "e" : ""
            } für Sie gefunden ✨`;
        }

        return `I found ${resultCount} product${
            resultCount > 1 ? "s" : ""
        } for you ✨`;
    };

    const getNoResultMessage = (lang) => {
        if (lang === "hindi") {
            return "माफ़ कीजिए 😔 मुझे आपके लिए कोई matching product नहीं मिला। दूसरी category या budget try करें।";
        }

        if (lang === "hinglish") {
            return "Sorry 😔 mujhe matching product nahi mila. Dusri category ya budget try kijiye.";
        }

        if (lang === "bengali") {
            return "দুঃখিত 😔 আপনার জন্য কোনো matching product খুঁজে পাইনি। অন্য category বা budget চেষ্টা করুন।";
        }

        if (lang === "spanish") {
            return "Lo siento 😔 No encontré productos que coincidan. Prueba otra categoría o presupuesto.";
        }

        if (lang === "french") {
            return "Désolé 😔 Je n'ai trouvé aucun produit correspondant. Essayez une autre catégorie ou un autre budget.";
        }

        if (lang === "german") {
            return "Entschuldigung 😔 Ich konnte keine passenden Produkte finden. Versuchen Sie eine andere Kategorie oder ein anderes Budget.";
        }

        return "Sorry 😔 I couldn't find matching products. Try another category or budget.";
    };

    const getErrorMessage = (lang) => {
        if (lang === "hindi") {
            return "माफ़ कीजिए, product database से connect नहीं हो पाया। कृपया फिर से try करें।";
        }

        if (lang === "hinglish") {
            return "Sorry, product database se connect nahi ho paya. Please dobara try kijiye.";
        }

        if (lang === "bengali") {
            return "দুঃখিত, product database-এর সাথে connect করা যায়নি। আবার চেষ্টা করুন।";
        }

        if (lang === "spanish") {
            return "Lo siento, no pude conectar con la base de datos de productos. Inténtalo de nuevo.";
        }

        if (lang === "french") {
            return "Désolé, je n'ai pas pu me connecter à la base de données des produits. Veuillez réessayer.";
        }

        if (lang === "german") {
            return "Entschuldigung, ich konnte keine Verbindung zur Produktdatenbank herstellen. Bitte versuchen Sie es erneut.";
        }

        return "I couldn't connect to the product database. Please try again.";
    };

    const getLoadingMessage = (lang) => {
        if (lang === "hindi") {
            return "आपके लिए best products खोज रहा हूँ... 🔎";
        }

        if (lang === "hinglish") {
            return "Aapke liye best products search kar raha hoon... 🔎";
        }

        if (lang === "bengali") {
            return "আপনার জন্য best products খুঁজছি... 🔎";
        }

        if (lang === "spanish") {
            return "Buscando los mejores productos para ti... 🔎";
        }

        if (lang === "french") {
            return "Je recherche les meilleurs produits pour vous... 🔎";
        }

        if (lang === "german") {
            return "Ich suche die besten Produkte für Sie... 🔎";
        }

        return "Finding the best products for you... 🔎";
    };

    const getAddedToCartMessage = (
        lang,
        productName
    ) => {
        if (lang === "hindi") {
            return `${productName} आपके cart में add कर दिया गया है 🛒`;
        }

        if (lang === "hinglish") {
            return `${productName} aapke cart mein add kar diya gaya hai 🛒`;
        }

        if (lang === "bengali") {
            return `${productName} আপনার cart-এ যোগ করা হয়েছে 🛒`;
        }

        if (lang === "spanish") {
            return `${productName} se añadió a tu carrito 🛒`;
        }

        if (lang === "french") {
            return `${productName} a été ajouté à votre panier 🛒`;
        }

        if (lang === "german") {
            return `${productName} wurde Ihrem Warenkorb hinzugefügt 🛒`;
        }

        return `${productName} has been added to your cart 🛒`;
    };

    const getNumberFromText = (text) => {
        const matches = text
            .replace(/,/g, "")
            .match(/\d+/g);

        if (!matches) {
            return null;
        }

        return Math.max(
            ...matches.map(Number)
        );
    };

    const detectCategory = (text) => {
        const query = text.toLowerCase();

        const categories = [
            "Shoes",
            "Electronics",
            "Mobile",
            "Audio",
            "Fashion",
            "Gaming",
            "Accessories",
            "Watches",
            "Home",
            "Sports"
        ];

        for (const category of categories) {
            if (
                query.includes(
                    category.toLowerCase()
                )
            ) {
                return category;
            }
        }

        const keywords = {
            headphone: "Audio",
            headphones: "Audio",
            earphone: "Audio",
            earphones: "Audio",
            earbuds: "Audio",
            speaker: "Audio",

            phone: "Mobile",
            smartphone: "Mobile",
            mobile: "Mobile",

            laptop: "Electronics",
            computer: "Electronics",

            keyboard: "Gaming",
            mouse: "Gaming",
            game: "Gaming",
            gaming: "Gaming",

            shoe: "Shoes",
            shoes: "Shoes",
            sneaker: "Shoes",
            sneakers: "Shoes",

            watch: "Watches",
            watches: "Watches",

            shirt: "Fashion",
            shirts: "Fashion",
            tshirt: "Fashion",
            "t-shirt": "Fashion",
            fashion: "Fashion",

            bag: "Accessories",
            bags: "Accessories",

            football: "Sports",
            cricket: "Sports",
            sports: "Sports",

            chair: "Home",
            table: "Home",
            home: "Home"
        };

        for (const keyword in keywords) {
            if (query.includes(keyword)) {
                return keywords[keyword];
            }
        }

        return null;
    };

    const filterProducts = (
        products,
        query
    ) => {
        const text = query.toLowerCase();

        const budget =
            getNumberFromText(text);

        const category =
            detectCategory(text);

        let results = [...products];

        if (category) {
            results = results.filter(
                (product) =>
                    String(
                        product.category || ""
                    ).toLowerCase() ===
                    category.toLowerCase()
            );
        }

        const isBudgetQuery =
            text.includes("under") ||
            text.includes("below") ||
            text.includes("less") ||
            text.includes("within") ||
            text.includes("budget") ||
            text.includes("ke andar") ||
            text.includes("se kam") ||
            text.includes("tak");

        if (
            budget &&
            isBudgetQuery
        ) {
            results = results.filter(
                (product) =>
                    Number(
                        product.price || 0
                    ) <= budget
            );
        }

        const ratingMatch =
            text.match(
                /(\d+(?:\.\d+)?)\s*(?:star|stars|rating)/
            );

        if (ratingMatch) {
            const minimumRating =
                Number(
                    ratingMatch[1]
                );

            results = results.filter(
                (product) =>
                    Number(
                        product.rating || 0
                    ) >= minimumRating
            );
        }

        if (
            text.includes(
                "best rated"
            ) ||
            text.includes(
                "highest rated"
            ) ||
            text.includes(
                "top rated"
            ) ||
            text.includes(
                "best rating"
            )
        ) {
            results.sort(
                (a, b) =>
                    Number(
                        b.rating || 0
                    ) -
                    Number(
                        a.rating || 0
                    )
            );
        }

        if (
            text.includes("cheap") ||
            text.includes("cheapest") ||
            text.includes(
                "lowest price"
            ) ||
            text.includes("sasta")
        ) {
            results.sort(
                (a, b) =>
                    Number(
                        a.price || 0
                    ) -
                    Number(
                        b.price || 0
                    )
            );
        }

        return results.slice(0, 5);
    };

    const addToCart = (product) => {
        const cart =
            JSON.parse(
                localStorage.getItem(
                    "shoppingWorldCart"
                )
            ) || [];

        const existingProduct =
            cart.find(
                (item) =>
                    item.name ===
                    product.name
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
                category:
                    product.category,
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
                text: getAddedToCartMessage(
                    language,
                    product.name
                )
            }
        ]);
    };

    const searchProducts =
        async (query, detectedLanguage) => {
            try {
                setLoading(true);

                const response =
                    await fetch(API_URL);

                if (!response.ok) {
                    throw new Error(
                        "Failed to load products"
                    );
                }

                const data =
                    await response.json();

                const products =
                    Array.isArray(data)
                        ? data
                        : data.products || [];

                const results =
                    filterProducts(
                        products,
                        query
                    );

                if (results.length === 0) {
                    setMessages(
                        (previous) => [
                            ...previous,
                            {
                                type: "ai",
                                text: getNoResultMessage(
                                    detectedLanguage
                                )
                            }
                        ]
                    );

                    return;
                }

                setMessages(
                    (previous) => [
                        ...previous,
                        {
                            type: "ai",
                            text: getResponseMessage(
                                detectedLanguage,
                                results.length
                            ),
                            products:
                                results
                        }
                    ]
                );
            } catch (error) {
                console.error(
                    "Shopping AI error:",
                    error
                );

                setMessages(
                    (previous) => [
                        ...previous,
                        {
                            type: "ai",
                            text: getErrorMessage(
                                detectedLanguage
                            )
                        }
                    ]
                );
            } finally {
                setLoading(false);
            }
        };

    const sendMessage = async (
        customMessage = null
    ) => {
        const text = (
            customMessage !== null
                ? customMessage
                : message
        ).trim();

        if (!text || loading) {
            return;
        }

        const detectedLanguage =
            detectLanguage(text);

        setLanguage(
            detectedLanguage
        );

        setMessages(
            (previous) => [
                ...previous,
                {
                    type: "user",
                    text
                }
            ]
        );

        setMessage("");

        await searchProducts(
            text,
            detectedLanguage
        );
    };

    const handleSuggestion = (
        text
    ) => {
        sendMessage(text);
    };

    const handleKeyDown = (
        event
    ) => {
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
                onClick={() =>
                    setOpen(!open)
                }
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
                                onClick={
                                    newChat
                                }
                                title="New Chat"
                            >
                                ＋
                            </button>

                            <button
                                className="shopping-ai-action"
                                onClick={
                                    resetChat
                                }
                                title="Refresh Chat"
                            >
                                ↻
                            </button>

                            <button
                                className="shopping-ai-close"
                                onClick={() =>
                                    setOpen(
                                        false
                                    )
                                }
                                title="Close"
                            >
                                ×
                            </button>

                        </div>

                    </div>

                    <div className="shopping-ai-messages">

                        {messages.map(
                            (
                                item,
                                index
                            ) => (
                                <div
                                    key={
                                        index
                                    }
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
                                            {
                                                item.text
                                            }
                                        </div>

                                        {item.products && (
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
                                    {
                                        getLoadingMessage(
                                            language
                                        )
                                    }
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
                            placeholder="Ask me what you need..."
                            value={
                                message
                            }
                            onChange={(
                                event
                            ) =>
                                setMessage(
                                    event
                                        .target
                                        .value
                                )
                            }
                            onKeyDown={
                                handleKeyDown
                            }
                            disabled={
                                loading
                            }
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