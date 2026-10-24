import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import styles from "../styles/TestimonialsForm.module.css";
import { FaPaperPlane } from "react-icons/fa";

const TestimonialsForm = ({ onSubmitted }) => {
  const [form, setForm] = useState({ name: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "testimonials_pending"), {
        name: form.name.trim(),
        message: form.message.trim(),
        createdAt: serverTimestamp(),
        approved: false,
      });
      setSent(true);
      setForm({ name: "", message: "" });
      if (onSubmitted) onSubmitted();
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className={styles.thankYou}>
        <h3>Shukriya! ❤️</h3>
        <p>Your testimonial has been submitted for review. It will appear once approved.</p>
        <button onClick={() => setSent(false)}>Submit another</button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3 className={styles.heading}>Share your words</h3>
      <p className={styles.subtext}>If SukoonNama touched your heart, tell us about it.</p>
      <input
        type="text"
        name="name"
        placeholder="Your name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <textarea
        name="message"
        placeholder="Your testimonial..."
        rows={4}
        value={form.message}
        onChange={handleChange}
        required
      />
      <button type="submit" disabled={loading}>
        <FaPaperPlane /> {loading ? "Sending..." : "Submit for review"}
      </button>
    </form>
  );
};

export default TestimonialsForm;
