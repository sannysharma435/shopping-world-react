import "./Contact.css";
import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      setStatus("❌ Please fill all fields");
      return;
    }

    setStatus("✅ Your message has been sent successfully!");

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  };

  return (
    <section className="contact-page">

      <div className="contact-box">

        <h1>Contact Us</h1>

        <p className="contact-text">
          If you have any questions or need information about a product,
          feel free to send us a message.
        </p>

        <form
          className="contact-form"
          onSubmit={handleSubmit}
        >

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
          />

          <textarea
            name="message"
            placeholder="Write your message..."
            rows="6"
            value={formData.message}
            onChange={handleChange}
          ></textarea>

          <button type="submit">
            Send Message
          </button>

        </form>

        {status && (
          <p className="contact-status">
            {status}
          </p>
        )}

      </div>

    </section>
  );
}

export default Contact;