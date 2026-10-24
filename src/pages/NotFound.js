import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/NotFound.module.css";
import { FaHome } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <div className={styles.content}>
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Lagta hai yeh page kho gaya hai... jaise kuch alfaaz adhure reh gaye hoon.</p>
        <Link to="/" className={styles.homeBtn}>
          <FaHome /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
