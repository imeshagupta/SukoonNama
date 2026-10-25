import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import styles from "../../styles/cms/CmsCommon.module.css";
import { FaTrashAlt, FaCheck, FaTimes, FaPlus, FaCloudUploadAlt } from "react-icons/fa";

const defaultTestimonials = [
  {
    name: "Aarav Mehta",
    message:
      "SukoonNama ने मेरी ज़िन्दगी के उन पहलुओं को शब्द दिए, जिन्हें मैं कभी बयां नहीं कर पाया था।",
  },
  {
    name: "Sonam Wadhwa",
    message:
      "हर शेर, हर ग़ज़ल दिल के बहुत करीब लगती है। जैसे किसी ने मेरी ही भावनाओं को लिख दिया हो।",
  },
  {
    name: "Ravi Kapoor",
    message:
      "ये सिर्फ एक वेबसाइट नहीं, ये एहसासों का समंदर है। हर बार कुछ नया महसूस होता है।",
  },
];

const CmsTestimonials = () => {
  const [items, setItems] = useState([]);
  const [pending, setPending] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState("");
  const [importing, setImporting] = useState(false);

  const fetchAll = async () => {
    setFetching(true);
    try {
      const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(all.filter((t) => t.approved === true));
      setPending(all.filter((t) => t.approved !== true));
    } catch (err) {
      try {
        const q2 = query(collection(db, "testimonials"));
        const snap2 = await getDocs(q2);
        const all = snap2.docs.map((d) => ({ id: d.id, ...d.data() }));
        setItems(all.filter((t) => t.approved === true));
        setPending(all.filter((t) => t.approved !== true));
      } catch (e) {
        console.error(e);
      }
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (actionMsg) {
      const t = setTimeout(() => setActionMsg(""), 2500);
      return () => clearTimeout(t);
    }
  }, [actionMsg]);

  const approve = async (id) => {
    try {
      await updateDoc(doc(db, "testimonials", id), { approved: true });
      fetchAll();
      setActionMsg("Approved");
    } catch (err) {
      console.error(err);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;
    try {
      await deleteDoc(doc(db, "testimonials", id));
      fetchAll();
      setActionMsg("Deleted");
    } catch (err) {
      console.error(err);
    }
  };

  const addManual = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "testimonials"), {
        name: name.trim(),
        message: message.trim(),
        approved: true,
        createdAt: new Date(),
      });
      setName("");
      setMessage("");
      setShowModal(false);
      fetchAll();
      setActionMsg("Added");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const importDefaults = async () => {
    setImporting(true);
    try {
      for (const t of defaultTestimonials) {
        await addDoc(collection(db, "testimonials"), {
          name: t.name,
          message: t.message,
          approved: true,
          createdAt: new Date(),
        });
      }
      fetchAll();
      setActionMsg("Imported to Firestore");
    } catch (err) {
      console.error(err);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Testimonials</h1>
          <p className={styles.pageSub}>Approve, delete or add testimonials</p>
        </div>
        <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
          <button className={styles.ghostBtn} onClick={importDefaults} disabled={importing}>
            <FaCloudUploadAlt /> {importing ? "Importing..." : "Import Existing"}
          </button>
          <button className={styles.primaryBtn} onClick={() => setShowModal(true)}>
            <FaPlus /> Add Testimonial
          </button>
        </div>
      </div>

      {actionMsg && <div className={styles.toast}>{actionMsg}</div>}

      {pending.length > 0 && (
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2>Pending Approval ({pending.length})</h2>
          </div>
          <div className={styles.cardGrid}>
            {pending.map((t) => (
              <div key={t.id} className={styles.reviewCard}>
                <p className={styles.reviewText}>"{t.message}"</p>
                <p className={styles.reviewName}>- {t.name}</p>
                <div className={styles.reviewActions}>
                  <button className={styles.approveBtn} onClick={() => approve(t.id)}>
                    <FaCheck /> Approve
                  </button>
                  <button className={styles.rejectBtn} onClick={() => remove(t.id)}>
                    <FaTimes /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h2>Approved ({items.length})</h2>
        </div>
        {fetching ? (
          <p className={styles.centerText}>Loading...</p>
        ) : items.length === 0 ? (
          <p className={styles.centerText}>No approved testimonials</p>
        ) : (
          <div className={styles.cardGrid}>
            {items.map((t) => (
              <div key={t.id} className={styles.reviewCard}>
                <p className={styles.reviewText}>"{t.message || t.feedback}"</p>
                <p className={styles.reviewName}>- {t.name}</p>
                <div className={styles.reviewActions}>
                  <button className={styles.rejectBtn} onClick={() => remove(t.id)}>
                    <FaTrashAlt /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Add Testimonial</h2>
              <button className={styles.closeModal} onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={addManual} className={styles.modalForm}>
              <div className={styles.formRow}>
                <label>Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className={styles.formRow}>
                <label>Message</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} required />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.ghostBtn} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.primaryBtn} disabled={loading}>
                  {loading ? "Saving..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CmsTestimonials;
