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
import { db } from "../firebase/firebase";
import styles from "../styles/Admin.module.css";
import {
  FaFeatherAlt,
  FaSignOutAlt,
  FaCheckCircle,
  FaPlus,
  FaList,
  FaTrashAlt,
  FaHeart,
  FaRedo,
} from "react-icons/fa";
import { Helmet } from "react-helmet-async";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("add");
  const [title, setTitle] = useState("");
  const [poem, setPoem] = useState("");
  const [category, setCategory] = useState("Love");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [poems, setPoems] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    localStorage.setItem("isAdmin", "true");
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (actionMsg) {
      const timer = setTimeout(() => setActionMsg(""), 2500);
      return () => clearTimeout(timer);
    }
  }, [actionMsg]);

  const fetchPoems = async () => {
    setFetching(true);
    try {
      const q = query(collection(db, "poems"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const poemsData = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setPoems(poemsData);
    } catch (err) {
      console.error("Error fetching poems: ", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (activeTab === "manage") {
      fetchPoems();
    }
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (poem.trim() === "") return;

    setLoading(true);
    try {
      await addDoc(collection(db, "poems"), {
        title: title.trim() || null,
        poem,
        category,
        createdAt: new Date(),
        likes: 0,
      });
      setSuccess(true);
      setTitle("");
      setPoem("");
      setCategory("Love");
    } catch (err) {
      console.error("Error adding document: ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this poem?")) return;
    try {
      await deleteDoc(doc(db, "poems", id));
      setPoems((prev) => prev.filter((p) => p.id !== id));
      setActionMsg("Poem deleted");
    } catch (err) {
      console.error("Error deleting poem: ", err);
    }
  };

  const handleResetLikes = async (id) => {
    if (!window.confirm("Reset likes for this poem to 0?")) return;
    try {
      await updateDoc(doc(db, "poems", id), { likes: 0 });
      setPoems((prev) =>
        prev.map((p) => (p.id === id ? { ...p, likes: 0 } : p))
      );
      setActionMsg("Likes reset to 0");
    } catch (err) {
      console.error("Error resetting likes: ", err);
    }
  };

  const truncateText = (text, max = 80) => {
    if (!text) return "";
    return text.length > max ? text.substring(0, max) + "..." : text;
  };

  return (
    <div className={styles.pageWrapper}>
      <Helmet>
        <title>Admin | SukoonNama</title>
      </Helmet>
      <div className={styles.adminShell}>
        <div className={styles.topBar}>
          <div className={styles.brand}>
            <FaFeatherAlt className={styles.brandIcon} />
            <div>
              <h1 className={styles.brandTitle}>SukoonNama Admin</h1>
              <p className={styles.brandSub}>Manage poems with ease</p>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("isAdmin");
              window.location.href = "/";
            }}
            className={styles.logoutTop}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tabBtn} ${activeTab === "add" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("add")}
          >
            <FaPlus /> Add Poem
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === "manage" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("manage")}
          >
            <FaList /> Manage Poems
          </button>
        </div>

        {activeTab === "add" && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Add New Poem</h2>
              <p className={styles.cardSub}>Fill in the details below</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.formGrid}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Title (Optional)</label>
                <input
                  type="text"
                  placeholder="Enter poem title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={styles.select}
                >
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
              </div>

              <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Poem Content</label>
                <textarea
                  placeholder="Write your poem here..."
                  value={poem}
                  onChange={(e) => setPoem(e.target.value)}
                  rows={10}
                  required
                  className={styles.textarea}
                />
              </div>

              <div className={styles.fullWidth}>
                <button type="submit" className={styles.primaryBtn} disabled={loading}>
                  <FaFeatherAlt /> {loading ? "Publishing..." : "Publish Poem"}
                </button>
              </div>

              {success && (
                <div className={`${styles.fullWidth} ${styles.alertSuccess}`}>
                  <FaCheckCircle /> Poem published successfully!
                </div>
              )}
            </form>
          </div>
        )}

        {activeTab === "manage" && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.cardTitle}>Manage Poems</h2>
                <p className={styles.cardSub}>
                  {poems.length} poem{poems.length !== 1 ? "s" : ""} total
                </p>
              </div>
              <button onClick={fetchPoems} className={styles.ghostBtn}>
                <FaRedo /> Refresh
              </button>
            </div>

            {actionMsg && <div className={styles.toast}>{actionMsg}</div>}

            {fetching ? (
              <p className={styles.loadingText}>Loading poems...</p>
            ) : poems.length === 0 ? (
              <p className={styles.emptyText}>No poems found</p>
            ) : (
              <div className={styles.poemList}>
                {poems.map((p) => (
                  <div key={p.id} className={styles.poemItem}>
                    <div className={styles.poemInfo}>
                      <div className={styles.poemMeta}>
                        <span className={styles.categoryTag}>{p.category}</span>
                        <span className={styles.likesTag}>
                          <FaHeart /> {p.likes || 0}
                        </span>
                      </div>
                      <h3 className={styles.poemTitle}>
                        {p.title || "Untitled Poem"}
                      </h3>
                      <p className={styles.poemPreview}>{truncateText(p.poem)}</p>
                    </div>
                    <div className={styles.poemActions}>
                      <button
                        onClick={() => handleResetLikes(p.id)}
                        className={styles.actionBtn}
                        title="Reset likes"
                      >
                        <FaRedo /> Reset Likes
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        title="Delete poem"
                      >
                        <FaTrashAlt /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
