import React, { useState } from "react";
import styles from "../../styles/cms/CmsCommon.module.css";
import { FaPlus, FaTrashAlt, FaImages } from "react-icons/fa";

const CmsGallery = () => {
  const [images, setImages] = useState([
    { id: 1, name: "img1.jpg" },
    { id: 2, name: "img2.jpg" },
    { id: 3, name: "img3.jpg" },
    { id: 4, name: "img4.jpg" },
    { id: 5, name: "img5.jpg" },
    { id: 6, name: "img6.jpg" },
    { id: 7, name: "img7.jpg" },
    { id: 8, name: "img8.jpg" },
    { id: 9, name: "img9.jpg" },
    { id: 10, name: "img10.jpg" },
    { id: 11, name: "img11.jpg" },
    { id: 12, name: "img12.jpg" },
    { id: 13, name: "img13.jpg" },
    { id: 14, name: "img14.jpg" },
    { id: 15, name: "img15.jpg" },
  ]);

  const handleDelete = (id) => {
    if (!window.confirm("Remove this certificate/image?")) return;
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Certificates & Gallery</h1>
          <p className={styles.pageSub}>Manage images shown in About page</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => alert("Upload feature coming soon. Add images to src/assets/ folder for now.")}>
          <FaPlus /> Add Image
        </button>
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h2>Gallery Images ({images.length})</h2>
        </div>
        <div className={styles.galleryGrid}>
          {images.map((img) => (
            <div key={img.id} className={styles.galleryCard}>
              <div className={styles.galleryThumb}>
                <FaImages />
              </div>
              <div className={styles.galleryInfo}>
                <p>{img.name}</p>
                <button className={styles.deleteSmall} onClick={() => handleDelete(img.id)}>
                  <FaTrashAlt /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <p className={styles.hintText}>
          Note: To add actual images, upload to <code>src/assets/</code> and update <code>About.js</code> or use Firebase Storage later.
        </p>
      </div>
    </div>
  );
};

export default CmsGallery;
