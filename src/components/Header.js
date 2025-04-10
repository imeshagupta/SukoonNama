import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Header.module.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/"></Link>
      </div>

      <button className={styles.menuToggle} onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      <nav className={`${styles.nav} ${isOpen ? styles.showNav : ""}`}>
        <ul onClick={() => setIsOpen(false)}>
          <li>
            <Link to="/" className={styles.navLink}>
              Home
            </Link>
          </li>

          <li>
            <Link to="/about" className={styles.navLink}>
              About
            </Link>
          </li>
          <li>
            <Link to="/testimonials" className={styles.navLink}>
              Testimonials
            </Link>
          </li>
          <li>
            <Link to="/faqs" className={styles.navLink}>
              FAQs
            </Link>
          </li>
          <li>
            <Link to="/contact" className={styles.navLink}>
              Contact Us
            </Link>
          </li>
        </ul>
      </nav>

      {/* <div className={styles.authButtons}>
        <Link to="/signup">
          <button className={styles.signupBtn}>Sign Up</button>
        </Link>
      </div> */}
    </header>
  );
};

export default Header;
