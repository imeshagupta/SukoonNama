import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Footer.module.css";
import { FaInstagram, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.topRow}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>
            SukoonNama
          </Link>
        </div>
        <div className={styles.navGroup}>
          <h4 className={styles.navTitle}>Quick Links</h4>
          <ul className={styles.navLinks}>
            <li>
              <Link to="/" className={styles.link}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className={styles.link}>
                About
              </Link>
            </li>
            <li>
              <Link to="/testimonials" className={styles.link}>
                Testimonials
              </Link>
            </li>
            <li>
              <Link to="/faqs" className={styles.link}>
                FAQs
              </Link>
            </li>
            <li>
              <Link to="/contact" className={styles.link}>
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.socialGroup}>
          <h4 className={styles.socialTitle}>Connect</h4>
          <div className={styles.socialRow}>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="mailto:example@gmail.com" aria-label="Gmail">
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <p className={styles.copyRight}>© {new Date().getFullYear()} Esha Gupta. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
