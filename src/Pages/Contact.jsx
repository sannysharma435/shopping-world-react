import "./Contact.css";

function Contact() {
  return (
    <section className="contact-page">

      <div className="contact-box">

        <h1>Contact Us</h1>

        <p className="contact-text">
          Agar aapka koi question hai ya kisi product ke baare me
          jaankari chahiye, to hume message bhejiye.
        </p>

        <form className="contact-form">

          <input
            type="text"
            placeholder="Your Name"
          />

          <input
            type="email"
            placeholder="Your Email"
          />

          <input
            type="text"
            placeholder="Subject"
          />

          <textarea
            placeholder="Write your message..."
            rows="6"
          ></textarea>

          <button type="submit">
            Send Message
          </button>

        </form>

      </div>

    </section>
  );
}

export default Contact;