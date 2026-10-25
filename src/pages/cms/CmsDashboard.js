import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import styles from "../../styles/cms/CmsCommon.module.css";
import { FaFeatherAlt, FaComments, FaQuestionCircle, FaImages, FaClock } from "react-icons/fa";

const CmsDashboard = () => {
  const [stats, setStats] = useState({
    poems: 0,
    testimonials: 0,
    pending: 0,
    faqs: 0,
  });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const poemsSnap = await getDocs(collection(db, "poems"));
        const testimonialsSnap = await getDocs(collection(db, "testimonials"));
        const faqsSnap = await getDocs(collection(db, "faqs"));

        const poems = poemsSnap.docs.map((d) => ({ id: d.id, ...d.data(), type: "poem" }));
        const testimonials = testimonialsSnap.docs.map((d) => ({ id: d.id, ...d.data(), type: "testimonial" }));

        setStats({
          poems: poemsSnap.size,
          testimonials: testimonialsSnap.docs.filter((d) => d.data().approved === true).length,
          pending: testimonialsSnap.docs.filter((d) => d.data().approved !== true).length,
          faqs: faqsSnap.size,
        });

        const recentItems = [...poems, ...testimonials]
          .filter((i) => i.createdAt)
          .sort((a, b) => {
            const ta = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
            const tb = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
            return tb - ta;
          })
          .slice(0, 6);

        setRecent(recentItems);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSub}>Content Management System • All at one place</p>
        </div>
      </div>

      <div className={styles.statGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIconWrap}>
            <FaFeatherAlt />
          </div>
          <div>
            <p className={styles.statLabel}>Total Poems</p>
            <p className={styles.statValue}>{stats.poems}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconWrap}>
            <FaComments />
          </div>
          <div>
            <p className={styles.statLabel}>Approved Testimonials</p>
            <p className={styles.statValue}>{stats.testimonials}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconWrap}>
            <FaClock />
          </div>
          <div>
            <p className={styles.statLabel}>Pending Testimonials</p>
            <p className={styles.statValue}>{stats.pending}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconWrap}>
            <FaQuestionCircle />
          </div>
          <div>
            <p className={styles.statLabel}>FAQs</p>
            <p className={styles.statValue}>{stats.faqs}</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconWrap}>
            <FaImages />
          </div>
          <div>
            <p className={styles.statLabel}>Certificates/Gallery</p>
            <p className={styles.statValue}>15</p>
          </div>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h2>Recent Changes</h2>
        </div>
        <div className={styles.activityList}>
          {recent.length === 0 ? (
            <p className={styles.centerText}>No recent activity</p>
          ) : (
            recent.map((item) => (
              <div key={item.id} className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  {item.type === "poem" ? <FaFeatherAlt /> : <FaComments />}
                </div>
                <div>
                  <p className={styles.activityTitle}>
                    {item.type === "poem"
                      ? `New poem${item.title ? `: ${item.title}` : ""}`
                      : `Testimonial from ${item.name}`}
                  </p>
                  <p className={styles.activitySub}>
                    {item.type === "poem"
                      ? "Added to Poems section"
                      : item.approved
                      ? "Approved testimonial"
                      : "Pending testimonial"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CmsDashboard;
