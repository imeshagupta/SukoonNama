import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import styles from "../../styles/cms/CmsCommon.module.css";
import {
  FaPlus,
  FaTrashAlt,
  FaHeart,
  FaRedo,
  FaTimes,
} from "react-icons/fa";

const CmsPoems = () => {
  const [poems, setPoems] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [poem, setPoem] = useState("");
  const [category, setCategory] = useState("Love");
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const fetchPoems = async () => {
    setFetching(true);
    try {
      const q = query(collection(db, "poems"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPoems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchPoems();
  }, []);

  useEffect(() => {
    if (actionMsg) {
      const t = setTimeout(() => setActionMsg(""), 2500);
      return () => clearTimeout(t);
    }
  }, [actionMsg]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!poem.trim()) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "poems"), {
        title: title.trim() || null,
        poem,
        category,
        createdAt: new Date(),
        likes: 0,
      });
      setTitle("");
      setPoem("");
      setCategory("Love");
      setShowModal(false);
      fetchPoems();
      setActionMsg("Poem added successfully");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this poem?")) return;
    try {
      await deleteDoc(doc(db, "poems", id));
      setPoems((prev) => prev.filter((p) => p.id !== id));
      setActionMsg("Poem deleted");
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetLikes = async (id) => {
    if (!window.confirm("Reset likes to 0?")) return;
    try {
      await updateDoc(doc(db, "poems", id), { likes: 0 });
      setPoems((prev) => prev.map((p) => (p.id === id ? { ...p, likes: 0 } : p)));
      setActionMsg("Likes reset");
    } catch (err) {
      console.error(err);
    }
  };

  const truncate = (t, m = 90) => (!t ? "" : t.length > m ? t.slice(0, m) + "..." : t);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Poems</h1>
          <p className={styles.pageSub}>Add, delete or reset likes for poems</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => setShowModal(true)}>
          <FaPlus /> Add Poem
        </button>
      </div>

      {actionMsg && <div className={styles.toast}>{actionMsg}</div>}

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <span>All Poems ({poems.length})</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                border: "1.5px solid rgba(142, 36, 170, 0.3)",
                borderRadius: "999px",
                padding: "0.5rem 1rem",
              }}
            >
              <option value="All">All Categories</option>
              <option value="Love">Love</option>
              <option value="Sad">Sad</option>
              <option value="Motivational">Motivational</option>
              <option value="Devotional">Devotional</option>
              <option value="Childhood">Childhood</option>
              <option value="Festival">Festival</option>
              <option value="Life">Life</option>
              <option value="Humor">Humor</option>
              <option value="Friendship">Friendship</option>
              <option value="Parents">Parents</option>
              <option value="Trust">Trust</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                border: "1.5px solid rgba(142, 36, 170, 0.3)",
                borderRadius: "999px",
                padding: "0.5rem 1rem",
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="likes">Most Liked</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>
        {fetching ? (
          <p className={styles.centerText}>Loading...</p>
        ) : poems.length === 0 ? (
          <p className={styles.centerText}>No poems yet</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Preview</th>
                  <th>Likes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {poems
                  .filter((p) => filterCategory === "All" || p.category === filterCategory)
                  .sort((a, b) => {
                    if (sortBy === "oldest") {
                      const ta = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
                      const tb = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
                      return ta - tb;
                    }
                    if (sortBy === "likes") {
                      return (b.likes || 0) - (a.likes || 0);
                    }
                    if (sortBy === "title") {
                      return (a.title || "").localeCompare(b.title || "");
                    }
                    const ta = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
                    const tb = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
                    return tb - ta;
                  })
                  .map((p) => (
                  <tr key={p.id}>
                    <td>{p.title || "Untitled"}</td>
                    <td>
                      <span className={styles.tag}>{p.category}</span>
                    </td>
                    <td className={styles.previewCell}>{truncate(p.poem)}</td>
                    <td>
                      <span className={styles.likeCount}>
                        <FaHeart /> {p.likes || 0}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionGroup}>
                        <button className={styles.iconBtn} onClick={() => handleResetLikes(p.id)} title="Reset likes">
                          <FaRedo />
                        </button>
                        <button className={`${styles.iconBtn} ${styles.dangerBtn}`} onClick={() => handleDelete(p.id)} title="Delete">
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Add New Poem</h2>
              <button className={styles.closeModal} onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAdd} className={styles.modalForm}>
              <div className={styles.formRow}>
                <label>Title (Optional)</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" />
              </div>
              <div className={styles.formRow}>
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option>Love</option>
                  <option>Sad</option>
                  <option>Motivational</option>
                  <option>Devotional</option>
                  <option>Childhood</option>
                  <option>Festival</option>
                  <option>Life</option>
                  <option>Humor</option>
                  <option>Friendship</option>
                  <option>Parents</option>
                  <option>Trust</option>
                </select>
              </div>
              <div className={styles.formRow}>
                <label>Poem Content *</label>
                <textarea value={poem} onChange={(e) => setPoem(e.target.value)} rows={10} required placeholder="Write poem..." />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.ghostBtn} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.primaryBtn} disabled={loading}>
                  {loading ? "Saving..." : "Save Poem"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CmsPoems;
