import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";
import styles from "../styles/PoemsList.module.css";

const PoemsList = () => {
  const [poems, setPoems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchPoems = async () => {
      const poemsCollection = collection(db, "poems");
      const q = query(poemsCollection, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const poemsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPoems(poemsList);
    };

    fetchPoems();
  }, []);

  const filteredPoems =
    selectedCategory === "All"
      ? poems
      : poems.filter((poem) => poem.category === selectedCategory);

  return (
    <div className={styles.poemList}>
      <h2 className={styles.heading}>SukoonNama Collection</h2>

      <div className={styles.categoryBar}>
        {[
          "All",
          "Love",
          "Sad",
          "Motivational",
          "Devotional",
          "Childhood",
          "Festival",
          "Life",
          "Humor",
          "Friendship",
          "Parents",
          "Trust",
        ].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`${styles.categoryButton} ${
              selectedCategory === cat ? styles.active : ""
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredPoems.length === 0 ? (
        <p className={styles.noPoems}>No poems in this category yet.</p>
      ) : (
        filteredPoems.map((poem) => {
          const categoryClass = `category-${
            poem.category?.toLowerCase() || "default"
          }`;
          return (
            <div
              key={poem.id}
              className={`${styles.poemCard} ${styles[categoryClass]}`}
            >
              <h3>{poem.title}</h3>
              <p>{poem.poem}</p>
              {poem.category && <p className={styles.categoryLabel}></p>}
            </div>
          );
        })
      )}
    </div>
  );
};

export default PoemsList;
