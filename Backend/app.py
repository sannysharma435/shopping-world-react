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
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT", "3306")),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
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