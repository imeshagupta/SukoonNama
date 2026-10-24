import React, { useEffect } from "react";
import styles from "../styles/GalleryLightbox.module.css";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const GalleryLightbox = ({ images, index, onClose, onPrev, onNext }) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "auto";
    };
  }, [onClose, onPrev, onNext]);

  if (index < 0 || index >= images.length) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
        <FaTimes />
      </button>
      <button className={styles.navBtn} style={{ left: "1rem" }} onClick={(e) => { e.stopPropagation(); onPrev(); }} aria-label="Previous">
        <FaChevronLeft />
      </button>
      <div className={styles.imageWrap} onClick={(e) => e.stopPropagation()}>
        <img src={images[index]} alt={`Certificate ${index + 1}`} />
      </div>
      <button className={styles.navBtn} style={{ right: "1rem" }} onClick={(e) => { e.stopPropagation(); onNext(); }} aria-label="Next">
        <FaChevronRight />
      </button>
    </div>
  );
};

export default GalleryLightbox;
