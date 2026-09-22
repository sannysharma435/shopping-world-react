from flask import Flask, request
from flask_cors import CORS
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
import os
from openai import OpenAI
import secrets
import smtplib
from email.message import EmailMessage
from datetime import datetime, timedelta


app = Flask(__name__)
CORS(app)


otp_store = {}


def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT", "4000")),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        ssl_ca=os.path.join(os.path.dirname(__file__), "ca.pem"),
        ssl_verify_cert=True,
        ssl_verify_identity=True
    )


@app.route("/")
def home():
    return {
        "message": "Shopping World Backend is Running!"
    }


@app.route("/api/db-test")
def db_test():
    try:
        db = get_db_connection()
        cursor = db.cursor()

        cursor.execute("SELECT DATABASE()")
        result = cursor.fetchone()

        cursor.close()
        db.close()

        return {
            "message": "MySQL Connected Successfully!",
            "database": result[0]
        }

    except Exception as error:
        print("DB ERROR:", error)

        return {
            "message": "MySQL Connection Failed",
            "error": str(error)
        }, 500


# =========================================================
# PRODUCTS
# =========================================================

@app.route("/api/products")
def get_products():
    products = [

        {
            "id": 1,
            "name": "Nike Air Max",
            "price": 2999,
            "rating": 4.8,
            "reviews": 245,
            "category": "Shoes",
            "brand": "Nike",
            "color": "Red",
            "discount": "20% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
            "description": "Nike Air Max is a stylish and comfortable running shoe designed for everyday use, sports and casual wear."
        },

        {
            "id": 2,
            "name": "Smart Watch Pro",
            "price": 4999,
            "rating": 4.6,
            "reviews": 245,
            "category": "Electronics",
            "brand": "Smart Tech",
            "color": "Silver",
            "discount": "20% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
            "description": "A stylish smart watch with fitness tracking, notifications and a premium modern design."
        },

        {
            "id": 3,
            "name": "iPhone",
            "price": 79999,
            "rating": 4.9,
            "reviews": 520,
            "category": "Mobile",
            "brand": "Apple",
            "color": "Black",
            "discount": "10% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
            "description": "A premium smartphone with powerful performance, beautiful display and an excellent camera."
        },

        {
            "id": 4,
            "name": "Premium Headphones",
            "price": 1999,
            "rating": 4.7,
            "reviews": 318,
            "category": "Audio",
            "brand": "SoundMax",
            "color": "Black",
            "discount": "25% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
            "description": "Enjoy immersive sound with comfortable headphones designed for music, movies and gaming."
        },

        {
            "id": 5,
            "name": "Adidas Running Shoes",
            "price": 3499,
            "rating": 4.7,
            "reviews": 186,
            "category": "Shoes",
            "brand": "Adidas",
            "color": "White",
            "discount": "30% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3",
            "description": "Lightweight Adidas running shoes designed for comfort, workouts and everyday walking."
        },

        {
            "id": 6,
            "name": "Men's Casual T-Shirt",
            "price": 799,
            "rating": 4.5,
            "reviews": 142,
            "category": "Fashion",
            "brand": "Urban Style",
            "color": "Black",
            "discount": "35% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
            "description": "Premium cotton casual T-shirt with a comfortable fit for everyday wear."
        },

        {
            "id": 7,
            "name": "Denim Jacket",
            "price": 2499,
            "rating": 4.6,
            "reviews": 98,
            "category": "Fashion",
            "brand": "Urban Style",
            "color": "Blue",
            "discount": "25% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1551028719-00167b16eac5",
            "description": "Classic denim jacket with a modern fit suitable for casual and outdoor outfits."
        },

        {
            "id": 8,
            "name": "Wireless Earbuds",
            "price": 1599,
            "rating": 4.5,
            "reviews": 412,
            "category": "Audio",
            "brand": "SoundMax",
            "color": "White",
            "discount": "40% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1",
            "description": "Compact wireless earbuds with clear audio, deep bass and a comfortable fit."
        },

        {
            "id": 9,
            "name": "Gaming Mouse",
            "price": 1299,
            "rating": 4.7,
            "reviews": 275,
            "category": "Gaming",
            "brand": "GamePro",
            "color": "Black",
            "discount": "20% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1527814050087-3793815479db",
            "description": "High precision gaming mouse with responsive controls and ergonomic design."
        },

        {
            "id": 10,
            "name": "Gaming Keyboard",
            "price": 2299,
            "rating": 4.8,
            "reviews": 194,
            "category": "Gaming",
            "brand": "GamePro",
            "color": "Black",
            "discount": "25% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
            "description": "Mechanical-style gaming keyboard designed for gaming and fast typing."
        },

        {
            "id": 11,
            "name": "Laptop Backpack",
            "price": 1499,
            "rating": 4.6,
            "reviews": 231,
            "category": "Accessories",
            "brand": "TravelPro",
            "color": "Black",
            "discount": "30% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
            "description": "Durable laptop backpack with multiple compartments for college, office and travel."
        },

        {
            "id": 12,
            "name": "Classic Wrist Watch",
            "price": 2799,
            "rating": 4.5,
            "reviews": 156,
            "category": "Watches",
            "brand": "TimeX",
            "color": "Black",
            "discount": "20% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d",
            "description": "Elegant classic wrist watch with a premium design suitable for everyday and formal wear."
        },

        {
            "id": 13,
            "name": "Women's Handbag",
            "price": 1899,
            "rating": 4.6,
            "reviews": 213,
            "category": "Fashion",
            "brand": "StyleBag",
            "color": "Brown",
            "discount": "35% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
            "description": "Stylish and spacious handbag designed for everyday use and special occasions."
        },

        {
            "id": 14,
            "name": "Sunglasses",
            "price": 999,
            "rating": 4.4,
            "reviews": 176,
            "category": "Fashion",
            "brand": "VisionPro",
            "color": "Black",
            "discount": "40% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
            "description": "Modern sunglasses with a stylish frame perfect for everyday outdoor use."
        },

        {
            "id": 15,
            "name": "Bluetooth Speaker",
            "price": 1799,
            "rating": 4.7,
            "reviews": 287,
            "category": "Audio",
            "brand": "SoundMax",
            "color": "Black",
            "discount": "30% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",
            "description": "Portable Bluetooth speaker with powerful sound and long-lasting battery."
        },

        {
            "id": 16,
            "name": "Tablet",
            "price": 18999,
            "rating": 4.6,
            "reviews": 164,
            "category": "Electronics",
            "brand": "TechPad",
            "color": "Silver",
            "discount": "15% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0",
            "description": "Slim tablet with a large display designed for entertainment, study and productivity."
        },

        {
            "id": 17,
            "name": "Laptop",
            "price": 59999,
            "rating": 4.8,
            "reviews": 342,
            "category": "Electronics",
            "brand": "TechBook",
            "color": "Silver",
            "discount": "10% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
            "description": "Powerful laptop suitable for students, professionals, coding and entertainment."
        },

        {
            "id": 18,
            "name": "Gaming Controller",
            "price": 2499,
            "rating": 4.7,
            "reviews": 221,
            "category": "Gaming",
            "brand": "GamePro",
            "color": "Black",
            "discount": "20% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1605901309584-818e25960a8f",
            "description": "Comfortable wireless gaming controller designed for smooth and responsive gameplay."
        },

        {
            "id": 19,
            "name": "LED Desk Lamp",
            "price": 899,
            "rating": 4.5,
            "reviews": 119,
            "category": "Home",
            "brand": "HomeLite",
            "color": "White",
            "discount": "30% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
            "description": "Modern LED desk lamp perfect for studying, working and reading."
        },

        {
            "id": 20,
            "name": "Coffee Maker",
            "price": 3499,
            "rating": 4.6,
            "reviews": 87,
            "category": "Home",
            "brand": "HomeBrew",
            "color": "Black",
            "discount": "25% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd",
            "description": "Compact coffee maker designed to prepare delicious coffee quickly at home."
        },

        {
            "id": 21,
            "name": "Travel Shoes",
            "price": 2199,
            "rating": 4.5,
            "reviews": 134,
            "category": "Shoes",
            "brand": "WalkPro",
            "color": "Grey",
            "discount": "30% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3",
            "description": "Comfortable lightweight shoes designed for walking, travel and everyday activities."
        },

        {
            "id": 22,
            "name": "Hoodie",
            "price": 1599,
            "rating": 4.7,
            "reviews": 203,
            "category": "Fashion",
            "brand": "Urban Style",
            "color": "Grey",
            "discount": "35% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
            "description": "Soft and comfortable hoodie designed for casual everyday fashion."
        },

        {
            "id": 23,
            "name": "Power Bank",
            "price": 1299,
            "rating": 4.6,
            "reviews": 365,
            "category": "Accessories",
            "brand": "PowerMax",
            "color": "Black",
            "discount": "25% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1609592424773-6c9f0a8e6b4e",
            "description": "High-capacity power bank for charging smartphones and other devices while travelling."
        },

        {
            "id": 24,
            "name": "Phone Case",
            "price": 499,
            "rating": 4.4,
            "reviews": 428,
            "category": "Accessories",
            "brand": "CasePro",
            "color": "Transparent",
            "discount": "40% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1601593346740-925612772716",
            "description": "Slim protective phone case with a stylish design and comfortable grip."
        },

        {
            "id": 25,
            "name": "Fitness Band",
            "price": 1999,
            "rating": 4.5,
            "reviews": 245,
            "category": "Electronics",
            "brand": "FitTech",
            "color": "Black",
            "discount": "30% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1576243345690-4e4b79b63288",
            "description": "Smart fitness band for activity tracking, steps, heart rate and daily workouts."
        },

        {
            "id": 26,
            "name": "Sports Cap",
            "price": 699,
            "rating": 4.4,
            "reviews": 98,
            "category": "Fashion",
            "brand": "SportStyle",
            "color": "Black",
            "discount": "30% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1521369909029-2afed882baee",
            "description": "Lightweight sports cap suitable for running, travel and outdoor activities."
        },

        {
            "id": 27,
            "name": "Running T-Shirt",
            "price": 899,
            "rating": 4.6,
            "reviews": 156,
            "category": "Sports",
            "brand": "SportStyle",
            "color": "Blue",
            "discount": "25% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
            "description": "Breathable sports T-shirt designed for running, workouts and outdoor activities."
        },

        {
            "id": 28,
            "name": "Yoga Mat",
            "price": 999,
            "rating": 4.7,
            "reviews": 189,
            "category": "Sports",
            "brand": "FitLife",
            "color": "Purple",
            "discount": "20% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f",
            "description": "Comfortable non-slip yoga mat designed for yoga, stretching and home workouts."
        },

        {
            "id": 29,
            "name": "Office Chair",
            "price": 8999,
            "rating": 4.6,
            "reviews": 112,
            "category": "Home",
            "brand": "ComfortSeat",
            "color": "Black",
            "discount": "15% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1580480055273-228ff5388ef8",
            "description": "Ergonomic office chair designed for comfortable long working and study sessions."
        },

        {
            "id": 30,
            "name": "Smart LED Bulb",
            "price": 699,
            "rating": 4.5,
            "reviews": 178,
            "category": "Home",
            "brand": "SmartHome",
            "color": "White",
            "discount": "35% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1507457379470-08b800bebc67",
            "description": "Smart LED bulb for modern homes with energy-efficient lighting and stylish design."
        }

    ]

    return products


# =========================================================
# SIGNUP
# =========================================================

@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.get_json()

    if not data:
        return {
            "message": "Please provide signup data"
        }, 400

    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    password = data.get("password")

    if not name or not email or not phone or not password:
        return {
            "message": "Please fill all fields"
        }, 400

    try:
        db = get_db_connection()
        cursor = db.cursor()

        cursor.execute(
            "SELECT id FROM users WHERE email = %s",
            (email,)
        )

        existing_user = cursor.fetchone()

        if existing_user:
            cursor.close()
            db.close()

            return {
                "message": "Email already registered"
            }, 409

        hashed_password = generate_password_hash(password)

        cursor.execute(
            """
            INSERT INTO users
            (name, email, phone, password)
            VALUES (%s, %s, %s, %s)
            """,
            (
                name,
                email,
                phone,
                hashed_password
            )
        )

        db.commit()

        cursor.close()
        db.close()

        return {
            "message": "Account created successfully!"
        }, 201

    except Exception as error:
        print("SIGNUP ERROR:", error)

        return {
            "message": "Signup failed",
            "error": str(error)
        }, 500


# =========================================================
# LOGIN
# =========================================================

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return {
            "message": "Please provide login data"
        }, 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return {
            "message": "Please enter email and password"
        }, 400

    try:
        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT id, name, email, phone, password
            FROM users
            WHERE email = %s
            """,
            (email,)
        )

        user = cursor.fetchone()

        if not user:
            cursor.close()
            db.close()

            return {
                "message": "Invalid email or password"
            }, 401

        if not check_password_hash(
            user["password"],
            password
        ):
            cursor.close()
            db.close()

            return {
                "message": "Invalid email or password"
            }, 401

        user.pop("password")

        cursor.close()
        db.close()

        return {
            "message": "Login successful!",
            "user": user
        }, 200

    except Exception as error:
        print("LOGIN ERROR:", error)

        return {
            "message": "Login failed",
            "error": str(error)
        }, 500


# =========================================================
# FORGOT PASSWORD
# =========================================================

@app.route("/api/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()

    if not data:
        return {
            "message": "Please provide email"
        }, 400

    email = data.get("email")

    if not email:
        return {
            "message": "Please enter your email"
        }, 400

    try:
        db = get_db_connection()
        cursor = db.cursor()

        cursor.execute(
            "SELECT id FROM users WHERE email = %s",
            (email,)
        )

        user = cursor.fetchone()

        cursor.close()
        db.close()

        if not user:
            return {
                "message": "No account found with this email"
            }, 404

        otp = str(
            secrets.randbelow(900000) + 100000
        )

        otp_store[email] = {
            "otp": otp,
            "expires": datetime.now() + timedelta(
                minutes=5
            )
        }

        sender = os.getenv("MAIL_USERNAME")
        app_password = os.getenv("MAIL_PASSWORD")

        if not sender or not app_password:
            print(
                "OTP ERROR: MAIL_USERNAME or MAIL_PASSWORD is missing"
            )

            return {
                "message": "Email configuration is missing"
            }, 500

        message = EmailMessage()

        message["Subject"] = (
            "Shopping World Password Reset OTP"
        )

        message["From"] = sender
        message["To"] = email

        message.set_content(
            f"Your Shopping World password reset OTP is: {otp}\n\n"
            "This OTP will expire in 5 minutes."
        )

        with smtplib.SMTP_SSL(
            "smtp.gmail.com",
            465
        ) as smtp:

            smtp.login(
                sender,
                app_password
            )

            smtp.send_message(message)

        return {
            "message": "OTP sent successfully"
        }, 200

    except Exception as error:
        print("OTP ERROR:", error)

        return {
            "message": "Failed to send OTP",
            "error": str(error)
        }, 500


# =========================================================
# VERIFY OTP
# =========================================================

@app.route("/api/verify-otp", methods=["POST"])
def verify_otp():
    data = request.get_json()

    if not data:
        return {
            "message": "Email and OTP are required"
        }, 400

    email = data.get("email")
    otp = data.get("otp")

    if not email or not otp:
        return {
            "message": "Email and OTP are required"
        }, 400

    stored = otp_store.get(email)

    if not stored:
        return {
            "message": "OTP not found or expired"
        }, 400

    if datetime.now() > stored["expires"]:
        otp_store.pop(email, None)

        return {
            "message": "OTP expired"
        }, 400

    if stored["otp"] != otp:
        return {
            "message": "Invalid OTP"
        }, 400

    return {
        "message": "OTP verified successfully"
    }, 200


# =========================================================
# RESET PASSWORD
# =========================================================

@app.route("/api/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json()

    if not data:
        return {
            "message": "Please fill all fields"
        }, 400

    email = data.get("email")
    otp = data.get("otp")
    password = data.get("password")

    if not email or not otp or not password:
        return {
            "message": "Please fill all fields"
        }, 400

    stored = otp_store.get(email)

    if not stored:
        return {
            "message": "OTP not found or expired"
        }, 400

    if datetime.now() > stored["expires"]:
        otp_store.pop(email, None)

        return {
            "message": "OTP expired"
        }, 400

    if stored["otp"] != otp:
        return {
            "message": "Invalid OTP"
        }, 400

    try:
        hashed_password = generate_password_hash(
            password
        )

        db = get_db_connection()
        cursor = db.cursor()

        cursor.execute(
            """
            UPDATE users
            SET password = %s
            WHERE email = %s
            """,
            (
                hashed_password,
                email
            )
        )

        db.commit()

        cursor.close()
        db.close()

        otp_store.pop(email, None)

        return {
            "message": "Password reset successfully"
        }, 200

    except Exception as error:
        print(
            "RESET PASSWORD ERROR:",
            error
        )

        return {
            "message": "Password reset failed",
            "error": str(error)
        }, 500


# =========================================================
# ORDERS
# =========================================================

@app.route("/api/orders", methods=["POST"])
def create_order():
    data = request.get_json()

    if not data:
        return {
            "message": "Order data is required"
        }, 400

    customer = data.get(
        "customer",
        {}
    )

    address = data.get(
        "deliveryAddress",
        {}
    )

    delivery = data.get(
        "delivery",
        {}
    )

    product = data.get(
        "product",
        {}
    )

    payment = data.get(
        "payment",
        {}
    )

    required_customer = [
        customer.get("name"),
        customer.get("mobile"),
        customer.get("email")
    ]

    required_address = [
        address.get("house"),
        address.get("area"),
        address.get("city"),
        address.get("state"),
        address.get("pincode")
    ]

    required_delivery = [
        delivery.get("date"),
        delivery.get("timeSlot")
    ]

    required_product = [
        product.get("name"),
        product.get("quantity"),
        product.get("price")
    ]

    if not all(required_customer):
        return {
            "message": "Customer details are incomplete"
        }, 400

    if not all(required_address):
        return {
            "message": "Delivery address is incomplete"
        }, 400

    if not all(required_delivery):
        return {
            "message": "Delivery details are incomplete"
        }, 400

    if not all(required_product):
        return {
            "message": "Product details are incomplete"
        }, 400

    try:
        order_id = (
            "SW" +
            secrets.token_hex(4).upper()
        )

        db = get_db_connection()
        cursor = db.cursor()

        cursor.execute(
            """
            INSERT INTO orders (
                order_id,
                customer_name,
                customer_mobile,
                customer_email,
                house,
                area,
                city,
                state,
                pincode,
                product_name,
                product_image,
                quantity,
                total_amount,
                payment_method,
                payment_status,
                delivery_date,
                time_slot,
                order_status
            )
            VALUES (
                %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s,
                %s, %s, %s, %s, %s,
                %s, %s, %s
            )
            """,
            (
                order_id,

                customer["name"],
                customer["mobile"],
                customer["email"],

                address["house"],
                address["area"],
                address["city"],
                address["state"],
                address["pincode"],

                product["name"],
                product.get("image"),

                int(product["quantity"]),
                float(product["price"]),

                payment.get(
                    "method",
                    "unknown"
                ),

                payment.get(
                    "status",
                    "Pending"
                ),

                delivery["date"],
                delivery["timeSlot"],

                "Pending"
            )
        )

        db.commit()

        cursor.close()
        db.close()

        return {
            "message": "Order created successfully",

            "order": {
                "orderId": order_id,
                "status": "Pending",
                "customer": customer,
                "deliveryAddress": address,
                "delivery": delivery,
                "product": product,
                "payment": payment
            }

        }, 201

    except Exception as error:
        print(
            "ORDER ERROR:",
            error
        )

        return {
            "message": "Failed to create order",
            "error": str(error)
        }, 500


@app.route("/api/orders", methods=["GET"])
def get_orders():
    try:
        db = get_db_connection()

        cursor = db.cursor(
            dictionary=True
        )

        cursor.execute(
            """
            SELECT
                id,
                order_id,
                customer_name,
                customer_mobile,
                customer_email,
                house,
                area,
                city,
                state,
                pincode,
                product_name,
                product_image,
                quantity,
                total_amount,
                payment_method,
                payment_status,
                delivery_date,
                time_slot,
                order_status,
                created_at

            FROM orders

            ORDER BY created_at DESC
            """
        )

        orders = cursor.fetchall()

        cursor.close()
        db.close()

        for order in orders:

            if order.get(
                "delivery_date"
            ):
                order["delivery_date"] = str(
                    order["delivery_date"]
                )

            if order.get(
                "created_at"
            ):
                order["created_at"] = (
                    order["created_at"].isoformat()
                )

            if order.get(
                "total_amount"
            ) is not None:
                order["total_amount"] = float(
                    order["total_amount"]
                )

        return {
            "message": "Orders fetched successfully",
            "orders": orders
        }, 200

    except Exception as error:
        print(
            "GET ORDERS ERROR:",
            error
        )

        return {
            "message": "Failed to fetch orders",
            "error": str(error)
        }, 500


# =========================================================
# UPDATE ORDER STATUS
# =========================================================

@app.route(
    "/api/orders/<order_id>/status",
    methods=["PUT"]
)
def update_order_status(order_id):
    data = request.get_json()

    if not data:
        return {
            "message": "Order status is required"
        }, 400

    status = data.get("status")

    allowed_statuses = [
        "Pending",
        "Confirmed",
        "Packed",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled"
    ]

    if status not in allowed_statuses:
        return {
            "message": "Invalid order status",
            "allowed_statuses": allowed_statuses
        }, 400

    try:
        db = get_db_connection()
        cursor = db.cursor()

        cursor.execute(
            """
            UPDATE orders
            SET order_status = %s
            WHERE order_id = %s
            """,
            (
                status,
                order_id
            )
        )

        if cursor.rowcount == 0:
            cursor.close()
            db.close()

            return {
                "message": "Order not found"
            }, 404

        db.commit()

        cursor.close()
        db.close()

        return {
            "message": "Order status updated successfully",
            "orderId": order_id,
            "status": status
        }, 200

    except Exception as error:
        print(
            "UPDATE ORDER STATUS ERROR:",
            error
        )

        return {
            "message": "Failed to update order status",
            "error": str(error)
        }, 500


# =========================================================
# SINGLE ORDER
# =========================================================

@app.route(
    "/api/orders/<order_id>",
    methods=["GET"]
)
def get_single_order(order_id):
    try:
        db = get_db_connection()

        cursor = db.cursor(
            dictionary=True
        )

        cursor.execute(
            """
            SELECT
                id,
                order_id,
                customer_name,
                customer_mobile,
                customer_email,
                house,
                area,
                city,
                state,
                pincode,
                product_name,
                product_image,
                quantity,
                total_amount,
                payment_method,
                payment_status,
                delivery_date,
                time_slot,
                order_status,
                created_at

            FROM orders

            WHERE order_id = %s
            """,
            (order_id,)
        )

        order = cursor.fetchone()

        cursor.close()
        db.close()

        if not order:
            return {
                "message": "Order not found"
            }, 404

        if order.get(
            "delivery_date"
        ):
            order["delivery_date"] = str(
                order["delivery_date"]
            )

        if order.get(
            "created_at"
        ):
            order["created_at"] = (
                order["created_at"].isoformat()
            )

        if order.get(
            "total_amount"
        ) is not None:
            order["total_amount"] = float(
                order["total_amount"]
            )

        return {
            "message": "Order fetched successfully",
            "order": order
        }, 200

    except Exception as error:
        print(
            "SINGLE ORDER ERROR:",
            error
        )

        return {
            "message": "Failed to fetch order",
            "error": str(error)
        }, 500


@app.route("/api/ai/chat", methods=["POST"])
def ai_chat():
    data = request.get_json() or {}
    message = str(data.get("message", "")).strip()
    history = data.get("history", [])

    if not message:
        return {"message": "Please enter a message"}, 400

    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        return {"message": "OpenAI API key is not configured"}, 500

    try:
        products = get_products()
        product_context = []

        for product in products:
            product_context.append({
                "id": product["id"],
                "name": product["name"],
                "price": product["price"],
                "rating": product["rating"],
                "reviews": product["reviews"],
                "category": product["category"],
                "brand": product["brand"],
                "color": product["color"],
                "discount": product["discount"],
                "availability": product["availability"],
                "description": product["description"]
            })

        system_prompt = f"""You are Shopping World AI, the intelligent shopping assistant for Shopping World.

Answer general questions naturally and helpfully, even when they are unrelated to shopping.
For shopping questions, use only the product catalog provided below for product facts. Never invent products, prices, ratings, discounts, availability, brands, or specifications that are not present in the catalog.
If the user asks for recommendations, compare relevant products using the catalog and explain why each may fit their requirements.
If no catalog product matches the request, say that clearly and suggest what information the user could change.
Understand and reply in the language used by the user. You can respond in English, Hindi, Hinglish, Bengali, Spanish, French, German, or other languages when appropriate.
Keep answers conversational and useful. Use simple formatting when it improves readability.
Do not claim to have performed actions that you cannot perform.

Shopping World product catalog:
{product_context}"""

        safe_history = []

        if isinstance(history, list):
            for item in history[-12:]:
                if not isinstance(item, dict):
                    continue
                role = item.get("role")
                content = item.get("content")
                if role in ["user", "assistant"] and isinstance(content, str) and content.strip():
                    safe_history.append({
                        "role": role,
                        "content": content[:4000]
                    })

        input_messages = safe_history + [
            {
                "role": "user",
                "content": message[:6000]
            }
        ]

        client = OpenAI(api_key=api_key)

        response = client.responses.create(
            model="gpt-5.6-luna",
            instructions=system_prompt,
            input=input_messages,
            max_output_tokens=800
        )

        answer = response.output_text

        if not answer:
            return {"message": "AI did not return a response"}, 500

        return {
            "reply": answer,
            "products": []
        }, 200

    except Exception as error:
        print("AI CHAT ERROR:", error)
        return {
            "message": "Sorry, I could not connect to the AI right now.",
            "error": str(error)
        }, 500


# =========================================================
# SERVER
# =========================================================

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(
            os.getenv(
                "PORT",
                5000
            )
        ),
        debug=False
    )