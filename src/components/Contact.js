import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import styles from "../styles/Contact.module.css";
import { FaEnvelope, FaLinkedin, FaInstagram, FaTwitter, FaPaperPlane } from "react-icons/fa";
import { Helmet } from "react-helmet-async";

const Contact = () => {
  const form = useRef();
  const [sent, setSent] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        form.current,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        (result) => {
          console.log("Email successfully sent!", result.text);
          setSent(true);
          form.current.reset();
          setTimeout(() => setSent(false), 4000);
        },
        (error) => {
          console.error("Error sending email:", error.text);
          alert(
            "There was an error sending your message. Please try again later."
          );
        }
      );
  };

  return (
    <section className={styles.contactSection} id="contact">
      <Helmet>
        <title>Contact | SukoonNama</title>
        <meta name="description" content="Get in touch with SukoonNama by Esha Gupta." />
      </Helmet>
      <div className={styles.contactContainer}>
        <div className={styles.contactGrid}>
          <div className={styles.contactLeft}>
            <div className={styles.leftHeader}>
              <h2 className={styles.sectionTitle}>Get in Touch</h2>
              <p className={styles.contactText}>
                Have a poem to share, feedback, or just want to say hello? I'd love to hear from you.
              </p>
            </div>

            <div className={styles.contactCards}>
              <a className={styles.contactCard} href="mailto:eshagupta515@gmail.com">
                <div className={styles.iconWrap}>
                  <FaEnvelope />
                </div>
                <div className={styles.cardContent}>
                  <h4>Email</h4>
                  <p>eshagupta515@gmail.com</p>
                </div>
              </a>
              <a className={styles.contactCard} href="https://linkedin.com/in/imeshagupta" target="_blank" rel="noopener noreferrer">
                <div className={styles.iconWrap}>
                  <FaLinkedin />
                </div>
                <div className={styles.cardContent}>
                  <h4>LinkedIn</h4>
                  <p>linkedin.com/in/imeshagupta</p>
                </div>
              </a>
              <a className={styles.contactCard} href="https://instagram.com/i.esha.27" target="_blank" rel="noopener noreferrer">
                <div className={styles.iconWrap}>
                  <FaInstagram />
                </div>
                <div className={styles.cardContent}>
                  <h4>Instagram</h4>
                  <p>@i.esha.27</p>
                </div>
              </a>
              <a className={styles.contactCard} href="https://twitter.com/imeshagupta" target="_blank" rel="noopener noreferrer">
                <div className={styles.iconWrap}>
                  <FaTwitter />
                </div>
                <div className={styles.cardContent}>
                  <h4>Twitter</h4>
                  <p>@imeshagupta</p>
                </div>
              </a>
            </div>
          </div>

          <div className={styles.contactRight}>
            <form ref={form} onSubmit={sendEmail} className={styles.contactForm}>
              <div className={styles.formHeader}>
                <h3>Send a Message</h3>
                <p>I'll get back to you soon.</p>
              </div>
              <input type="text" name="name" placeholder="Your Name" required />
              <input type="email" name="email" placeholder="Your Email" required />
              <textarea name="message" placeholder="Your Message" rows={3} required></textarea>
              <button type="submit" className={styles.contactBtn}>
                <FaPaperPlane /> {sent ? "Message Sent!" : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
