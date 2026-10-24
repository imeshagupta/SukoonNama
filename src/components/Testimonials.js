import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import styles from "../styles/Testimonials.module.css";
import TestimonialsForm from "./TestimonialsForm";
import { Helmet } from "react-helmet-async";

const staticTestimonials = [
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

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState(staticTestimonials);
  const [showForm, setShowForm] = useState(false);

  const fetchTestimonials = async () => {
    try {
      const q = query(
        collection(db, "testimonials"),
        where("approved", "==", true),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const fetched = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTestimonials([...fetched, ...staticTestimonials]);
      }
    } catch (err) {
      try {
        const q2 = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
        const snapshot2 = await getDocs(q2);
        if (!snapshot2.empty) {
          const fetched = snapshot2.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setTestimonials([...fetched, ...staticTestimonials]);
        }
      } catch (e) {
        // keep static
      }
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <section className={styles.testimonials}>
      <Helmet>
        <title>Testimonials | SukoonNama</title>
        <meta name="description" content="Read what people say about SukoonNama - shayari and jazbaat by Esha Gupta." />
      </Helmet>
      <div className={styles.container}>
        <h2 className={styles.heading}>पाठकों की राय</h2>
        <div className={styles.headerRow}>
          <p className={styles.intro}>Dil se nikle shukriya... If SukoonNama touched your heart, do share your words.</p>
          <button className={styles.addBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? "Close" : "Write a Testimonial"}
          </button>
        </div>
        {showForm && (
          <div className={styles.formWrap}>
            <TestimonialsForm
              onSubmitted={() => {
                fetchTestimonials();
                setShowForm(false);
              }}
            />
          </div>
        )}
        <div className={styles.grid}>
          {testimonials.map((item, index) => (
            <article key={item.id || index} className={styles.card}>
              <p className={styles.feedback}>"{item.message || item.feedback}"</p>
              <p className={styles.name}>- {item.name}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
