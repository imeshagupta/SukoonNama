import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase/firebase";
import styles from "../styles/PoemsList.module.css";
import PoemModal from "./PoemModal";
import { FaHeart, FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const POEMS_PER_PAGE = 6;

const getPoemTime = (createdAt) => {
  if (!createdAt) return 0;
  if (typeof createdAt.toDate === "function") return createdAt.toDate().getTime();
  if (createdAt instanceof Date) return createdAt.getTime();
  if (typeof createdAt.seconds === "number") return createdAt.seconds * 1000;
  const time = new Date(createdAt).getTime();
  return Number.isNaN(time) ? 0 : time;
};

const PoemsList = () => {
  const [poems, setPoems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPoem, setSelectedPoem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [poemOfTheDay, setPoemOfTheDay] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPoems = async () => {
      try {
        const poemsCollection = collection(db, "poems");
        const q = query(poemsCollection, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const rawPoems = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        const seen = new Set();
        const poemsList = rawPoems.filter((poem) => {
          const key = (poem.poem || "").replace(/\s+/g, " ").trim();
          if (!key || seen.has(key)) return false;
          seen.add(key);
          return true;
        });
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

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, sortOrder]);

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

  const sortedPoems = [...filteredPoems].sort((a, b) => {
    const timeA = getPoemTime(a.createdAt);
    const timeB = getPoemTime(b.createdAt);
    return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
  });

  const totalPages = Math.ceil(sortedPoems.length / POEMS_PER_PAGE) || 1;
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const paginatedPoems = sortedPoems.slice(
    (safePage - 1) * POEMS_PER_PAGE,
    safePage * POEMS_PER_PAGE
  );

  const goToPage = (page) => {
    setCurrentPage(page);
    document
      .getElementById("poems")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const pageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    let start = Math.max(1, safePage - 2);
    let end = start + 4;
    if (end > totalPages) {
      end = totalPages;
      start = end - 4;
    }
    const pages = [];
    if (start > 1) pages.push(1, "start-ellipsis");
    for (let i = start; i <= end; i += 1) pages.push(i);
    if (end < totalPages) pages.push("end-ellipsis", totalPages);
    return pages;
  };

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
            {poemOfTheDay.title && <h4>{poemOfTheDay.title}</h4>}
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

      <div className={styles.controlsRow}>
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
        <select
          className={styles.sortSelect}
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          aria-label="Sort poems"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
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
        <div className={styles.poemGrid}>
          {paginatedPoems.map((poem) => {
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
                  {poem.title && <h3>{poem.title}</h3>}
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
          })}
        </div>
      )}

      {!loading && filteredPoems.length > 0 && totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage === 1}
            aria-label="Previous page"
          >
            <FaChevronLeft />
          </button>

          {pageNumbers().map((page) =>
            typeof page === "number" ? (
              <button
                key={page}
                className={`${styles.pageBtn} ${
                  page === safePage ? styles.pageBtnActive : ""
                }`}
                onClick={() => goToPage(page)}
                aria-label={`Go to page ${page}`}
                aria-current={page === safePage ? "page" : undefined}
              >
                {page}
              </button>
            ) : (
              <span key={page} className={styles.pageEllipsis}>
                …
              </span>
            )
          )}

          <button
            className={styles.pageBtn}
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage === totalPages}
            aria-label="Next page"
          >
            <FaChevronRight />
          </button>
        </div>
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
