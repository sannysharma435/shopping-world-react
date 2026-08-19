from flask import Flask, request
from flask_cors import CORS
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
import os
import secrets
import smtplib
from email.message import EmailMessage
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

otp_store = {}


def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Sanny@123",
        database="shopping_world"
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
            "name": "Smart Watch",
            "price": 4999,
            "rating": 4.6,
            "reviews": 245,
            "category": "Electronics",
            "brand": "Smart Watch",
            "color": "Silver",
            "discount": "20% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
            "description": "A stylish smart watch with a modern design for tracking activities and staying connected."
        },
        {
            "id": 3,
            "name": "iPhone",
            "price": 79999,
            "rating": 4.9,
            "reviews": 245,
            "category": "Mobile",
            "brand": "Apple",
            "color": "Black",
            "discount": "20% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
            "description": "A premium smartphone with a powerful processor, beautiful display and excellent camera."
        },
        {
            "id": 4,
            "name": "Headphones",
            "price": 1999,
            "rating": 4.7,
            "reviews": 245,
            "category": "Audio",
            "brand": "Premium Audio",
            "color": "Black",
            "discount": "20% OFF",
            "delivery": "Free Delivery",
            "availability": "In Stock",
            "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
            "description": "Enjoy immersive audio with comfortable headphones designed for music, movies and gaming."
        }
    ]

    return products


@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.get_json()

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
            (name, email, phone, hashed_password)
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


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()

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

        if not check_password_hash(user["password"], password):
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


@app.route("/api/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()

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

        otp = str(secrets.randbelow(900000) + 100000)

        otp_store[email] = {
            "otp": otp,
            "expires": datetime.now() + timedelta(minutes=5)
        }

        sender = os.getenv("MAIL_USERNAME")
        app_password = os.getenv("MAIL_PASSWORD")

        if not sender or not app_password:
            print("OTP ERROR: MAIL_USERNAME or MAIL_PASSWORD is missing")

            return {
                "message": "Email configuration is missing"
            }, 500

        message = EmailMessage()
        message["Subject"] = "Shopping World Password Reset OTP"
        message["From"] = sender
        message["To"] = email

        message.set_content(
            f"Your Shopping World password reset OTP is: {otp}\n\n"
            "This OTP will expire in 5 minutes."
        )

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(sender, app_password)
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


@app.route("/api/verify-otp", methods=["POST"])
def verify_otp():
    data = request.get_json()

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


@app.route("/api/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json()

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
        hashed_password = generate_password_hash(password)

        db = get_db_connection()
        cursor = db.cursor()

        cursor.execute(
            """
            UPDATE users
            SET password = %s
            WHERE email = %s
            """,
            (hashed_password, email)
        )

        db.commit()

        cursor.close()
        db.close()

        otp_store.pop(email, None)

        return {
            "message": "Password reset successfully"
        }, 200

    except Exception as error:
        print("RESET PASSWORD ERROR:", error)

        return {
            "message": "Password reset failed",
            "error": str(error)
        }, 500


if __name__ == "__main__":
    app.run(debug=True)