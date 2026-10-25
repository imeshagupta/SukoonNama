import React, { useEffect } from "react";
import styles from "../styles/PoemModal.module.css";
import { FaTimes, FaShareAlt, FaCopy, FaHeart, FaArrowRight } from "react-icons/fa";

const PoemModal = ({ poem, onClose, onLike, allPoems, onSelect }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  const handleCopy = async () => {
    try {
      const text = `${poem.title}\n\n${poem.poem}\n\n- SukoonNama by Esha Gupta`;
      await navigator.clipboard.writeText(text);
      alert("Poem copied to clipboard!");
    } catch (err) {
      alert("Unable to copy");
    }
  };

  const handleShare = async () => {
    const text = `${poem.title}\n\n${poem.poem}\n\nRead more on SukoonNama`;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: poem.title, text, url });
      } catch (err) {
        // ignore
      }
    } else {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(text + "\n" + url)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }
  };

  const related = allPoems
    .filter((p) => p.id !== poem.id && p.category === poem.category)
    .slice(0, 3);

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="poem-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <FaTimes />
        </button>
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <span className={styles.category}>{poem.category}</span>
              <h2 id="poem-title" className={styles.title}>
                {poem.title}
              </h2>
            </div>
            <button className={styles.likeLarge} onClick={onLike} aria-label="Like poem">
              <FaHeart /> {poem.likes || 0}
            </button>
          </div>
          <pre className={styles.poemText}>{poem.poem}</pre>
          <div className={styles.actions}>
            <button onClick={handleCopy}>
              <FaCopy /> Copy
            </button>
            <button onClick={handleShare}>
              <FaShareAlt /> Share
            </button>
          </div>
        </div>
        {related.length > 0 && (
          <div className={styles.related}>
            <h3>More from {poem.category}</h3>
            <div className={styles.relatedList}>
              {related.map((r) => (
                <button
                  key={r.id}
                  className={styles.relatedCard}
                  onClick={() => onSelect(r)}
                >
                  <div>
                    <h4>{r.title}</h4>
                    <p>{r.poem?.split("\n").slice(0, 2).join(" ")}</p>
                  </div>
                  <FaArrowRight />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PoemModal;
