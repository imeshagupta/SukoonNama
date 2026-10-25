import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase/firebase";
import styles from "../styles/PoemsList.module.css";
import PoemModal from "./PoemModal";
import { FaHeart, FaSearch } from "react-icons/fa";

const PoemsList = () => {
  const [poems, setPoems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPoem, setSelectedPoem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [poemOfTheDay, setPoemOfTheDay] = useState(null);

  useEffect(() => {
    const fetchPoems = async () => {
      try {
        const poemsCollection = collection(db, "poems");
        const q = query(poemsCollection, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const poemsList = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setPoems(poemsList);
        if (poemsList.length > 0) {
          const today = new Date().toDateString();
          const stored = localStorage.getItem("poemOfTheDay");
          const storedDate = localStorage.getItem("poemOfTheDayDate");
          if (stored && storedDate === today) {
            const found = poemsList.find((p) => p.id === stored);
            setPoemOfTheDay(found || poemsList[Math.floor(Math.random() * poemsList.length)]);
          } else {
            const random = poemsList[Math.floor(Math.random() * poemsList.length)];
            setPoemOfTheDay(random);
            localStorage.setItem("poemOfTheDay", random.id);
            localStorage.setItem("poemOfTheDayDate", today);
          }
        }
      } catch (err) {
        // ignore
      } finally {
        setLoading(false);
      }
    };

    fetchPoems();
  }, []);

  const categories = [
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
  ];

  const getCount = (cat) => {
    if (cat === "All") return poems.length;
    return poems.filter((poem) => poem.category === cat).length;
  };

  let filteredPoems =
    selectedCategory === "All"
      ? poems
      : poems.filter((poem) => poem.category === selectedCategory);

  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    filteredPoems = filteredPoems.filter(
      (poem) =>
        poem.title?.toLowerCase().includes(term) ||
        poem.poem?.toLowerCase().includes(term)
    );
  }

  const handleLike = async (poem) => {
    try {
      const ref = doc(db, "poems", poem.id);
      await updateDoc(ref, { likes: increment(1) });
      setPoems((prev) =>
        prev.map((p) => (p.id === poem.id ? { ...p, likes: (p.likes || 0) + 1 } : p))
      );
      if (selectedPoem?.id === poem.id) {
        setSelectedPoem((prev) => ({ ...prev, likes: (prev.likes || 0) + 1 }));
      }
      if (poemOfTheDay?.id === poem.id) {
        setPoemOfTheDay((prev) => ({ ...prev, likes: (prev.likes || 0) + 1 }));
      }
    } catch (err) {
      // ignore
    }
  };

  const openPoem = (poem) => setSelectedPoem(poem);
  const closePoem = () => setSelectedPoem(null);

  return (
    <div className={styles.poemList} id="poems">
      {poemOfTheDay && (
        <section className={styles.potd}>
          <div className={styles.potdHeader}>
            <h3>Sukoon of the Day</h3>
            <span>🌸 Handpicked for you</span>
          </div>
          <div className={styles.potdCard} onClick={() => openPoem(poemOfTheDay)}>
            <h4>{poemOfTheDay.title}</h4>
            <p className={styles.potdPreview}>{poemOfTheDay.poem?.split("\n").slice(0, 4).join("\n")}...</p>
            <div className={styles.potdFooter}>
              <span>{poemOfTheDay.category}</span>
              <button
                className={styles.likeBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(poemOfTheDay);
                }}
              >
                <FaHeart /> {poemOfTheDay.likes || 0}
              </button>
            </div>
          </div>
        </section>
      )}

      <div className={styles.searchWrap}>
        <FaSearch className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search poems by title or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search poems"
        />
      </div>

      <div className={styles.categoryBar}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`${styles.categoryButton} ${
              selectedCategory === cat ? styles.active : ""
            }`}
          >
            {cat}
            <span className={styles.count}>{getCount(cat)}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loaderWrap}>
          <div className={styles.loader}></div>
          <p>Loading poems...</p>
        </div>
      ) : filteredPoems.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🕊️</div>
          <p className={styles.noPoems}>No poems found here yet.</p>
          <p className={styles.emptyHint}>Try a different category or clear your search.</p>
        </div>
      ) : (
        filteredPoems.map((poem) => {
          const categoryClass = `category-${
            poem.category?.toLowerCase() || "default"
          }`;
          return (
            <article
              key={poem.id}
              className={`${styles.poemCard} ${styles[categoryClass]}`}
              onClick={() => openPoem(poem)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openPoem(poem);
                }
              }}
              aria-label={`Open poem ${poem.title}`}
            >
              <div className={styles.cardHeader}>
                <h3>{poem.title}</h3>
                <button
                  className={styles.likeBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(poem);
                  }}
                  aria-label="Like poem"
                >
                  <FaHeart /> {poem.likes || 0}
                </button>
              </div>
              <p className={styles.preview}>{poem.poem}</p>
              {poem.category && (
                <p className={styles.categoryLabel}>{poem.category}</p>
              )}
            </article>
          );
        })
      )}

      {selectedPoem && (
        <PoemModal
          poem={selectedPoem}
          onClose={closePoem}
          onLike={() => handleLike(selectedPoem)}
          allPoems={poems}
          onSelect={openPoem}
        />
      )}
    </div>
  );
};

export default PoemsList;
