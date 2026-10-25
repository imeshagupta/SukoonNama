import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import styles from "../../styles/cms/CmsCommon.module.css";
import { FaPlus, FaEdit, FaTrashAlt, FaTimes } from "react-icons/fa";

const CmsFaqs = () => {
  const [faqs, setFaqs] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  const fetchFaqs = async () => {
    setFetching(true);
    try {
      const q = query(collection(db, "faqs"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      if (data.length === 0) {
        const staticFaqs = [
          {
            question: "What is SukoonNama?",
            answer:
              "SukoonNama is a digital platform where poetry, thoughts, and heartfelt words are woven into expressions of emotion.",
            order: 1,
          },
          {
            question: "Can I share my poetry here?",
            answer:
              "Absolutely! We warmly welcome new writers. You can submit your creations through our 'Submit' page. We will showcase your work on our platform.",
            order: 2,
          },
          {
            question: "Is SukoonNama only in Hindi, Hinglish or English?",
            answer:
              "Primarily, SukoonNama focuses on Hindi, but we respect emotional expressions written in any language.",
            order: 3,
          },
          {
            question: "Is the content on SukoonNama free to read?",
            answer:
              "Yes, all poetry and writings on SukoonNama are available for free. Our aim is to share emotions, not earn profits.",
            order: 4,
          },
        ];
        for (const f of staticFaqs) {
          await addDoc(collection(db, "faqs"), f);
        }
        setFaqs(staticFaqs.map((f, i) => ({ id: `temp-${i}`, ...f })));
      } else {
        setFaqs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  useEffect(() => {
    if (actionMsg) {
      const t = setTimeout(() => setActionMsg(""), 2500);
      return () => clearTimeout(t);
    }
  }, [actionMsg]);

  const openAdd = () => {
    setEditing(null);
    setQuestion("");
    setAnswer("");
    setShowModal(true);
  };

  const openEdit = (faq) => {
    setEditing(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    setLoading(true);
    try {
      if (editing) {
        await updateDoc(doc(db, "faqs", editing.id), {
          question: question.trim(),
          answer: answer.trim(),
        });
        setActionMsg("Updated");
      } else {
        await addDoc(collection(db, "faqs"), {
          question: question.trim(),
          answer: answer.trim(),
          order: faqs.length + 1,
        });
        setActionMsg("Added");
      }
      setShowModal(false);
      fetchFaqs();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this FAQ?")) return;
    try {
      await deleteDoc(doc(db, "faqs", id));
      fetchFaqs();
      setActionMsg("Deleted");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>FAQs</h1>
          <p className={styles.pageSub}>Add, edit or delete FAQs</p>
        </div>
        <button className={styles.primaryBtn} onClick={openAdd}>
          <FaPlus /> Add FAQ
        </button>
      </div>

      {actionMsg && <div className={styles.toast}>{actionMsg}</div>}

      <div className={styles.sectionCard}>
        {fetching ? (
          <p className={styles.centerText}>Loading...</p>
        ) : faqs.length === 0 ? (
          <p className={styles.centerText}>No FAQs</p>
        ) : (
          <div className={styles.faqList}>
            {faqs.map((f) => (
              <div key={f.id} className={styles.faqItem}>
                <div className={styles.faqContent}>
                  <h3>{f.question}</h3>
                  <p>{f.answer}</p>
                </div>
                <div className={styles.actionGroup}>
                  <button className={styles.iconBtn} onClick={() => openEdit(f)}>
                    <FaEdit />
                  </button>
                  <button className={`${styles.iconBtn} ${styles.dangerBtn}`} onClick={() => handleDelete(f.id)}>
                    <FaTrashAlt />
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
              <h2>{editing ? "Edit FAQ" : "Add FAQ"}</h2>
              <button className={styles.closeModal} onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.formRow}>
                <label>Question</label>
                <input value={question} onChange={(e) => setQuestion(e.target.value)} required />
              </div>
              <div className={styles.formRow}>
                <label>Answer</label>
                <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={6} required />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.ghostBtn} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.primaryBtn} disabled={loading}>
                  {loading ? "Saving..." : editing ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CmsFaqs;
