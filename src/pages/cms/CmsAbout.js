import React, { useState } from "react";
import styles from "../../styles/cms/CmsCommon.module.css";
import { FaSave } from "react-icons/fa";

const CmsAbout = () => {
  const [content, setContent] = useState({
    whyTitle: "Why SukoonNama?",
    whyPara1:
      "SukoonNama एक ऐसी जगह है जहाँ शब्दों से जज़्बात बुनते हैं। यहाँ आपको मिलेंगी शायरियाँ, कविताएँ, और दिल से निकली हुई बातें — जो हर किसी के जज़्बातों को छू जाएँ।",
    whyPara2:
      "यह मंच उन सभी के लिए है जो अपने दिल की आवाज़ को लफ़्ज़ों में ढालना चाहते हैं। हमारी कोशिश है कि हम भावनाओं को एक रूप दें जो लोगों के दिलों को छू जाए।",
    whyPara3:
      "SukoonNama सिर्फ एक नाम नहीं, एक एहसास है। यह मंच शब्दों से सुकून देने का एक छोटा सा प्रयास है — जहाँ हर शायरी, हर कविता दिल के किसी कोने की आवाज़ बनकर सामने आती है। मेरा मकसद है कि जज़्बातों को लफ़्ज़ों में पिरोकर उन्हें ऐसे साझा करूँ कि पढ़ने वाले को भी वही सुकून मिले, जो लिखते वक़्त मुझे मिला था।",
    writerTitle: "Meet the Writer",
    writerBio1:
      "I, Esha Gupta, hail from Haldaur, Bijnor. I have a deep passion for poetry, along with a love for crafting and capturing the beauty of nature through photography.",
    writerBio2:
      "SukoonNama सिर्फ एक नाम नहीं, एक एहसास है — जो दिल से निकला और दिलों तक पहुँचा।",
    achievement1:
      "Worked as a co-author in 50+ anthologies, contributing heartfelt poems and shayaris.",
    achievement2:
      "Secured First Prize in an inter-college poetry competition during academic years.",
    achievement3:
      "Received certificates of appreciation from various literary platforms for outstanding contributions in poetry.",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>About Page</h1>
          <p className={styles.pageSub}>Edit about content and achievements</p>
        </div>
      </div>

      {saved && <div className={styles.toast}>Saved (local preview)</div>}

      <form onSubmit={handleSave}>
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2>Why SukoonNama</h2>
          </div>
          <div className={styles.formStack}>
            <div className={styles.formRow}>
              <label>Section Title</label>
              <input
                value={content.whyTitle}
                onChange={(e) => setContent({ ...content, whyTitle: e.target.value })}
              />
            </div>
            <div className={styles.formRow}>
              <label>Paragraph 1</label>
              <textarea
                rows={4}
                value={content.whyPara1}
                onChange={(e) => setContent({ ...content, whyPara1: e.target.value })}
              />
            </div>
            <div className={styles.formRow}>
              <label>Paragraph 2</label>
              <textarea
                rows={3}
                value={content.whyPara2}
                onChange={(e) => setContent({ ...content, whyPara2: e.target.value })}
              />
            </div>
            <div className={styles.formRow}>
              <label>Paragraph 3</label>
              <textarea
                rows={5}
                value={content.whyPara3}
                onChange={(e) => setContent({ ...content, whyPara3: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2>Meet the Writer</h2>
          </div>
          <div className={styles.formStack}>
            <div className={styles.formRow}>
              <label>Title</label>
              <input
                value={content.writerTitle}
                onChange={(e) => setContent({ ...content, writerTitle: e.target.value })}
              />
            </div>
            <div className={styles.formRow}>
              <label>Bio Paragraph 1</label>
              <textarea
                rows={3}
                value={content.writerBio1}
                onChange={(e) => setContent({ ...content, writerBio1: e.target.value })}
              />
            </div>
            <div className={styles.formRow}>
              <label>Bio Paragraph 2</label>
              <textarea
                rows={2}
                value={content.writerBio2}
                onChange={(e) => setContent({ ...content, writerBio2: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2>Writer's Achievements</h2>
          </div>
          <div className={styles.formStack}>
            <div className={styles.formRow}>
              <label>Achievement 1</label>
              <textarea
                rows={2}
                value={content.achievement1}
                onChange={(e) => setContent({ ...content, achievement1: e.target.value })}
              />
            </div>
            <div className={styles.formRow}>
              <label>Achievement 2</label>
              <textarea
                rows={2}
                value={content.achievement2}
                onChange={(e) => setContent({ ...content, achievement2: e.target.value })}
              />
            </div>
            <div className={styles.formRow}>
              <label>Achievement 3</label>
              <textarea
                rows={2}
                value={content.achievement3}
                onChange={(e) => setContent({ ...content, achievement3: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className={styles.saveBar}>
          <button type="submit" className={styles.primaryBtn}>
            <FaSave /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default CmsAbout;
