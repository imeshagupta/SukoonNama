import React, { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import styles from "../styles/Admin.module.css";

const Admin = () => {
  const [title, setTitle] = useState("");
  const [poem, setPoem] = useState("");
  const [category, setCategory] = useState("Love");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem("isAdmin", "true");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (poem.trim() === "") return; // Only poem is required

    try {
      await addDoc(collection(db, "poems"), {
        title: title.trim() || null, // Save null if title is empty
        poem,
        category,
        createdAt: new Date(),
      });
      setSuccess(true);
      setTitle("");
      setPoem("");
      setCategory("Love");
    } catch (err) {
      console.error("Error adding document: ", err);
    }
  };

  return (
    <div className={styles.adminContainer}>
      <h2 className={styles.heading}>Admin Panel - Submit a Poem</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Poem Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.formInput}
        />
        <br />
        <textarea
          placeholder="Write your poem here..."
          value={poem}
          onChange={(e) => setPoem(e.target.value)}
          rows={6}
          required
          className={styles.formTextarea}
        />
        <br />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={styles.formInput}
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
        <br />
        <button type="submit" className={styles.submitButton}>
          Submit Poem
        </button>
        {success && <p className={styles.successMessage}>Poem submitted!</p>}
      </form>
      <button
        onClick={() => {
          localStorage.removeItem("isAdmin");
          window.location.href = "/";
        }}
        className={styles.logoutButton}
      >
        Logout Admin
      </button>
    </div>
  );
};

export default Admin;
