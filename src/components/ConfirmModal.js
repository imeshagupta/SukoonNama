import React from "react";
import styles from "../styles/cms/CmsCommon.module.css";

const ConfirmModal = ({ open, title, message, onCancel, onConfirm }) => {
  if (!open) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onCancel}>
      <div className={styles.modal} style={{ maxWidth: "420px" }} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
        </div>
        <div style={{ padding: "1.4rem 2rem", color: "#5f3b70", lineHeight: "1.8" }}>
          <p style={{ margin: 0 }}>{message}</p>
        </div>
        <div className={styles.modalActions} style={{ padding: "0 2rem 1.8rem" }}>
          <button type="button" className={styles.ghostBtn} onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className={styles.primaryBtn} onClick={onConfirm}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
