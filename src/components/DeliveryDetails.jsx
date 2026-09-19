import { useState } from "react";
import "./DeliveryDetails.css";

function DeliveryDetails({
  product,
  quantity,
  total,
  onContinue,
  onClose
}) {
  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 2);

    return date.toISOString().split("T")[0];
  };

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    house: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    deliveryDate: getMinDate(),
    timeSlot: "9 AM - 12 PM"
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.mobile ||
      !form.email ||
      !form.house ||
      !form.area ||
      !form.city ||
      !form.state ||
      !form.pincode ||
      !form.deliveryDate ||
      !form.timeSlot
    ) {
      setError("Please fill all delivery details.");
      return;
    }

    if (!/^[0-9]{10}$/.test(form.mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!/^[0-9]{6}$/.test(form.pincode)) {
      setError("Please enter a valid 6-digit PIN code.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    onContinue({
      ...form,
      productName: product.name,
      productImage: product.image,
      quantity,
      total
    });
  };

  return (
    <div className="delivery-overlay">
      <div className="delivery-modal">

        <button
          className="delivery-close"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="delivery-header">
          <div className="delivery-icon">
            📦
          </div>

          <div>
            <h2>Delivery Details</h2>
            <p>
              Where should we deliver your order?
            </p>
          </div>
        </div>

        <div className="delivery-product">
          <img
            src={product.image}
            alt={product.name}
          />

          <div>
            <h3>{product.name}</h3>

            <p>
              Quantity: <strong>{quantity}</strong>
            </p>

            <strong>
              ₹{Number(total).toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <h3 className="delivery-section-title">
            👤 Customer Information
          </h3>

          <div className="delivery-grid">

            <div className="delivery-field">
              <label>Full Name *</label>

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="delivery-field">
              <label>Mobile Number *</label>

              <input
                type="tel"
                name="mobile"
                placeholder="10 digit mobile number"
                maxLength="10"
                value={form.mobile}
                onChange={handleChange}
              />
            </div>

            <div className="delivery-field full-width">
              <label>Email Address *</label>

              <input
                type="email"
                name="email"
                placeholder="example@gmail.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

          </div>

          <h3 className="delivery-section-title">
            🏠 Delivery Address
          </h3>

          <div className="delivery-grid">

            <div className="delivery-field">
              <label>House / Flat / Building *</label>

              <input
                type="text"
                name="house"
                placeholder="House / Flat No."
                value={form.house}
                onChange={handleChange}
              />
            </div>

            <div className="delivery-field">
              <label>Street / Area *</label>

              <input
                type="text"
                name="area"
                placeholder="Street / Area"
                value={form.area}
                onChange={handleChange}
              />
            </div>

            <div className="delivery-field">
              <label>City *</label>

              <input
                type="text"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
              />
            </div>

            <div className="delivery-field">
              <label>State *</label>

              <input
                type="text"
                name="state"
                placeholder="State"
                value={form.state}
                onChange={handleChange}
              />
            </div>

            <div className="delivery-field">
              <label>PIN Code *</label>

              <input
                type="text"
                name="pincode"
                placeholder="6 digit PIN"
                maxLength="6"
                value={form.pincode}
                onChange={handleChange}
              />
            </div>

          </div>

          <h3 className="delivery-section-title">
            🚚 Delivery Schedule
          </h3>

          <div className="delivery-grid">

            <div className="delivery-field">
              <label>Delivery Date *</label>

              <input
                type="date"
                name="deliveryDate"
                min={getMinDate()}
                value={form.deliveryDate}
                onChange={handleChange}
              />
            </div>

            <div className="delivery-field">
              <label>Preferred Time *</label>

              <select
                name="timeSlot"
                value={form.timeSlot}
                onChange={handleChange}
              >
                <option>9 AM - 12 PM</option>
                <option>12 PM - 3 PM</option>
                <option>3 PM - 6 PM</option>
                <option>6 PM - 9 PM</option>
              </select>
            </div>

          </div>

          {error && (
            <div className="delivery-error">
              ⚠️ {error}
            </div>
          )}

          <div className="delivery-summary">
            <span>Order Total</span>

            <strong>
              ₹{Number(total).toLocaleString("en-IN")}
            </strong>
          </div>

          <button
            type="submit"
            className="delivery-continue"
          >
            Continue to Payment →
          </button>

          <p className="delivery-security">
            🔒 Your delivery information is securely handled
          </p>

        </form>

      </div>
    </div>
  );
}

export default DeliveryDetails;